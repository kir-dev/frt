/** Shared browser/server form contract. Keys identify answers independently of labels. */
export const CORE_KEYS = [
    "name",
    "email",
    "phone",
    "university",
    "major",
    "semester",
    "groupName",
    "positionName",
    "motivation",
    "consent",
] as const
export type CoreKey = (typeof CORE_KEYS)[number]
export type QuestionType =
    | "text"
    | "textarea"
    | "select"
    | "multiselect"
    | "checkbox"
export type Answer = string | string[] | boolean
export interface QuestionOption {
    key: string
    label: string
    labelEng: string
}
export interface FormQuestion {
    key: string
    label: string
    labelEng: string
    hint?: string | null
    hintEng?: string | null
    type: QuestionType
    required?: boolean | null
    hidden?: boolean | null
    options?: QuestionOption[] | null
}
export interface FormConfig {
    version: string
    questions: FormQuestion[]
}
export const MAX_CV_SIZE = 5 * 1024 * 1024
export const DEFAULT_QUESTIONS: FormQuestion[] = [
    {
        key: "name",
        label: "Név",
        labelEng: "Name",
        type: "text",
        required: true,
    },
    {
        key: "email",
        label: "E-mail cím",
        labelEng: "Email address",
        type: "text",
        required: true,
    },
    {
        key: "phone",
        label: "Telefonszám",
        labelEng: "Phone number",
        type: "text",
    },
    {
        key: "semester",
        label: "Hányadik félév",
        labelEng: "Semester",
        type: "text",
    },
    {
        key: "university",
        label: "Egyetem / kar",
        labelEng: "University / faculty",
        type: "text",
    },
    { key: "major", label: "Szak", labelEng: "Major", type: "text" },
    { key: "groupName", label: "Csoport", labelEng: "Group", type: "text" },
    {
        key: "positionName",
        label: "Pozíció",
        labelEng: "Position",
        type: "text",
    },
    {
        key: "motivation",
        label: "Motiváció / üzenet",
        labelEng: "Motivation / message",
        type: "textarea",
    },
    {
        key: "consent",
        label: "Hozzájárulok a személyes adataim kezeléséhez a jelentkezés elbírálása céljából.",
        labelEng:
            "I consent to the processing of my personal data for the purpose of the application.",
        type: "checkbox",
        required: true,
    },
]
export function resolveFormConfig(
    settings?: {
        formQuestions?: FormQuestion[] | null
        updatedAt?: string | null
    } | null,
): FormConfig {
    return {
        version: settings?.updatedAt ?? "initial",
        questions: settings?.formQuestions?.length
            ? settings.formQuestions
            : DEFAULT_QUESTIONS,
    }
}
export function validateQuestions(questions: FormQuestion[]): true | string {
    if (!questions.length || questions.length > 50)
        return "Az űrlap 1–50 kérdést tartalmazhat."
    const keys = new Set<string>()
    for (const q of questions) {
        if (
            !q.key ||
            !/^[a-zA-Z0-9_-]{1,64}$/.test(q.key) ||
            keys.has(q.key) ||
            ["__proto__", "constructor", "prototype"].includes(q.key)
        )
            return "A kérdések azonosítói legyenek egyediek."
        keys.add(q.key)
        if (!q.label?.trim() || !q.labelEng?.trim())
            return "Minden kérdés magyar és angol felirata kötelező."
        const core = DEFAULT_QUESTIONS.find((item) => item.key === q.key)
        if (core && q.type !== core.type)
            return `Az alapmező típusa nem változtatható: ${core.label}.`
        if (q.type === "select" || q.type === "multiselect") {
            if (!q.options?.length || q.options.length > 30)
                return "A választós kérdésekhez 1–30 lehetőség szükséges."
            const options = new Set<string>()
            for (const option of q.options) {
                if (
                    !option.key ||
                    options.has(option.key) ||
                    !option.label?.trim() ||
                    !option.labelEng?.trim()
                )
                    return "A lehetőségek azonosítója legyen egyedi, mindkét felirat kötelező."
                options.add(option.key)
            }
        }
    }
    for (const key of ["name", "email", "consent"]) {
        const q = questions.find((item) => item.key === key)
        if (!q || q.hidden || !q.required)
            return "A név, e-mail és hozzájárulás kötelező, látható alapmező."
    }
    for (const key of ["groupName", "positionName"]) {
        if (!questions.some((item) => item.key === key))
            return "A csoport és pozíció alapmező nem törölhető (elrejthető)."
    }
    return true
}
export interface AnswerSnapshot {
    key: string
    label: string
    labelEng: string
    type: QuestionType
    options: QuestionOption[]
    value: Answer
}
const LIMITS: Record<string, number> = {
    name: 120,
    email: 200,
    phone: 40,
    university: 120,
    major: 120,
    semester: 40,
    groupName: 200,
    positionName: 200,
    motivation: 5000,
}
export function validateAnswers(
    input: Record<string, unknown>,
    config: FormConfig,
):
    | { ok: true; values: Record<string, Answer>; snapshots: AnswerSnapshot[] }
    | { ok: false; error: string; field?: string } {
    const values: Record<string, Answer> = {}
    const snapshots: AnswerSnapshot[] = []
    for (const q of config.questions) {
        // Hidden group/position still carry the position button's selection.
        if (q.hidden && q.key !== "groupName" && q.key !== "positionName")
            continue
        const raw = input[q.key]
        let value: Answer
        if (q.type === "checkbox") {
            if (raw !== undefined && typeof raw !== "boolean")
                return { ok: false, error: "INVALID_ANSWER", field: q.key }
            value = raw === true
        } else if (q.type === "multiselect") {
            if (
                raw !== undefined &&
                (!Array.isArray(raw) || raw.some((v) => typeof v !== "string"))
            )
                return { ok: false, error: "INVALID_ANSWER", field: q.key }
            value = [...new Set((raw ?? []) as string[])]
            if (value.some((v) => !q.options?.some((o) => o.key === v)))
                return { ok: false, error: "INVALID_ANSWER", field: q.key }
        } else {
            if (raw !== undefined && raw !== null && typeof raw !== "string")
                return { ok: false, error: "INVALID_ANSWER", field: q.key }
            value = typeof raw === "string" ? raw.trim() : ""
            if (
                value.length >
                (LIMITS[q.key] ?? (q.type === "textarea" ? 5000 : 500))
            )
                return { ok: false, error: "ANSWER_TOO_LONG", field: q.key }
            if (
                q.type === "select" &&
                value &&
                !q.options?.some((o) => o.key === value)
            )
                return { ok: false, error: "INVALID_ANSWER", field: q.key }
        }
        if (
            q.required &&
            !q.hidden &&
            (value === false ||
                (typeof value !== "boolean" && value.length === 0))
        )
            return { ok: false, error: "MISSING_FIELDS", field: q.key }
        if (
            q.key === "email" &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))
        )
            return { ok: false, error: "INVALID_EMAIL", field: q.key }
        values[q.key] = value
        snapshots.push({
            key: q.key,
            label: q.label,
            labelEng: q.labelEng,
            type: q.type,
            options: q.options ?? [],
            value,
        })
    }
    return { ok: true, values, snapshots }
}
export function summarizeAnswers(
    snapshots: AnswerSnapshot[],
    isEn: boolean,
    includeCore = false,
): string {
    return snapshots
        .filter((q) => includeCore || !CORE_KEYS.includes(q.key as CoreKey))
        .map((q) => {
            const label = isEn ? q.labelEng : q.label
            const format = (v: string) => {
                const option = q.options.find((o) => o.key === v)
                return option ? (isEn ? option.labelEng : option.label) : v
            }
            const value = Array.isArray(q.value)
                ? q.value.map(format).join(", ")
                : typeof q.value === "boolean"
                  ? q.value
                      ? isEn
                          ? "Yes"
                          : "Igen"
                      : isEn
                        ? "No"
                        : "Nem"
                  : format(q.value)
            return `${label}: ${value}`
        })
        .join("\n")
}
