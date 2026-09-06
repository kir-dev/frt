import styles from "./success-check.module.css"

export default function SuccessCheck() {
    return (
        <svg
            viewBox="0 0 48 48"
            width={48}
            height={48}
            fill="none"
            className={`${styles.icon} mx-auto mb-4 text-frtRed`}
            aria-hidden="true"
            focusable="false"
        >
            <circle cx={24} cy={24} r={22} fill="currentColor" opacity={0.08} />
            <circle
                className={styles.ring}
                cx={24}
                cy={24}
                r={20}
                pathLength={1}
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                transform="rotate(-90 24 24)"
            />
            <path
                className={styles.check}
                d="m15 24 6 6 12-13"
                pathLength={1}
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}
