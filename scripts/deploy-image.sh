#!/usr/bin/env bash

set -Eeuo pipefail

usage() {
  echo "Usage: $0 IMAGE_REF COMPOSE_PROJECT APP_ENV_FILE HEALTH_URL BACKUP_DATABASE [COMPOSE_OVERRIDE]" >&2
}

if [[ $# -lt 5 || $# -gt 6 ]]; then
  usage
  exit 2
fi

image_ref="$1"
compose_project="$2"
app_env_file="$3"
health_url="$4"
backup_database="$5"
compose_override="${6:-}"

if [[ ! "$image_ref" =~ ^ghcr\.io/[a-z0-9_.-]+/[a-z0-9_.-]+(@sha256:[a-f0-9]{64}|:[A-Za-z0-9_.-]+)$ ]]; then
  echo "Invalid GHCR image reference: $image_ref" >&2
  exit 2
fi

if [[ ! "$compose_project" =~ ^[a-zA-Z0-9][a-zA-Z0-9_.-]*$ ]]; then
  echo "Invalid Compose project name: $compose_project" >&2
  exit 2
fi

if [[ "$app_env_file" = /* || "$app_env_file" == *".."* ]]; then
  echo "APP_ENV_FILE must be a relative path inside the deployment directory." >&2
  exit 2
fi

if [[ ! "$health_url" =~ ^http://127\.0\.0\.1:[0-9]+/api/health$ ]]; then
  echo "HEALTH_URL must target the local environment health endpoint." >&2
  exit 2
fi

if [[ "$backup_database" != "true" && "$backup_database" != "false" ]]; then
  echo "BACKUP_DATABASE must be true or false." >&2
  exit 2
fi

if [[ -n "$compose_override" && ( "$compose_override" = /* || "$compose_override" == *".."* ) ]]; then
  echo "COMPOSE_OVERRIDE must be a relative path inside the deployment directory." >&2
  exit 2
fi

if [[ ! -f "$app_env_file" ]]; then
  echo "Missing application environment file: $app_env_file" >&2
  exit 1
fi

if [[ ! -f docker-compose.yml ]]; then
  echo "docker-compose.yml is missing from $(pwd)." >&2
  exit 1
fi

if [[ -n "$compose_override" && ! -f "$compose_override" ]]; then
  echo "Compose override is missing: $compose_override" >&2
  exit 1
fi

candidate_env=".env.deploy.next"
active_env=".env.deploy"
rollback_env=".env.deploy.rollback"
previous_image=""

cleanup() {
  rm -f "$candidate_env" "$rollback_env"
}

trap cleanup EXIT

write_deploy_env() {
  local target_file="$1"
  local target_image="$2"

  umask 077
  {
    printf 'FRT_APP_IMAGE=%s\n' "$target_image"
    printf 'APP_ENV_FILE=%s\n' "$app_env_file"
  } > "$target_file"
}

compose_with() {
  local deploy_env="$1"
  shift

  local args=(
    docker compose
    --env-file "$deploy_env"
    -p "$compose_project"
    -f docker-compose.yml
  )

  if [[ -n "$compose_override" ]]; then
    args+=(-f "$compose_override")
  fi

  "${args[@]}" "$@"
}

write_deploy_env "$candidate_env" "$image_ref"

current_container_id="$(compose_with "$candidate_env" ps -q app 2>/dev/null || true)"
if [[ -n "$current_container_id" ]]; then
  previous_image="$(docker inspect --format '{{.Config.Image}}' "$current_container_id" 2>/dev/null || true)"
fi

rollback_app() {
  if [[ -z "$previous_image" ]]; then
    echo "No previous application image is available for automatic rollback." >&2
    return 1
  fi

  echo "Rolling the application back to $previous_image" >&2
  write_deploy_env "$rollback_env" "$previous_image"
  compose_with "$rollback_env" up -d --no-build --pull never --wait --wait-timeout 120 app
}

echo "Pulling application image $image_ref"
compose_with "$candidate_env" pull app

echo "Starting the environment database"
compose_with "$candidate_env" up -d --wait --wait-timeout 120 postgres

if [[ "$backup_database" == "true" ]]; then
  backup_dir="backups"
  backup_path="$backup_dir/postgres-$(date -u +%Y%m%dT%H%M%SZ).dump"
  backup_tmp="$backup_path.tmp"
  mkdir -p "$backup_dir"

  echo "Creating production database backup at $backup_path"
  # The variables are intentionally expanded inside the PostgreSQL container.
  # shellcheck disable=SC2016
  if compose_with "$candidate_env" exec -T postgres sh -c \
    'pg_dump --format=custom --no-owner --no-acl -U "$POSTGRES_USER" "$POSTGRES_DB"' \
    > "$backup_tmp"; then
    mv "$backup_tmp" "$backup_path"
  else
    rm -f "$backup_tmp"
    exit 1
  fi
fi

echo "Running Payload migrations with the candidate image"
printf 'y\n' | compose_with "$candidate_env" run --rm -T app yarn payload:migrate

echo "Starting the candidate application"
if ! compose_with "$candidate_env" up -d --no-build --pull never --wait --wait-timeout 120 app; then
  rollback_app || true
  echo "Application startup failed. Database migrations are not rolled back automatically." >&2
  exit 1
fi

health_ok="false"
for _attempt in {1..12}; do
  if curl --fail --silent --show-error --max-time 10 "$health_url" >/dev/null; then
    health_ok="true"
    break
  fi
  sleep 5
done

if [[ "$health_ok" != "true" ]]; then
  rollback_app || true
  echo "Health check failed for $health_url. Database migrations are not rolled back automatically." >&2
  exit 1
fi

mv "$candidate_env" "$active_env"
chmod 600 "$active_env"

echo "Deployment completed successfully with $image_ref"
