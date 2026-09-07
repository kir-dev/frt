"use client"

const INPUT_CLASS =
    "w-full rounded-lg border border-white/15 bg-black/40 px-4 py-2.5 text-white placeholder:text-gray-500 focus:border-frtRed focus:outline-none focus:ring-1 focus:ring-frtRed"
const LABEL_CLASS = "mb-1.5 block text-sm font-medium text-gray-200"

interface LabelParts {
    label: string
    required?: boolean
    /** Pl. „opcionális" — halványan a címke mögé kerül. */
    hint?: string
}

interface FieldLabelProps extends LabelParts {
    htmlFor: string
}

function FieldLabel({ htmlFor, label, required, hint }: FieldLabelProps) {
    return (
        <label className={LABEL_CLASS} htmlFor={htmlFor}>
            {label}
            {required && " *"}
            {hint && <span className="text-gray-500"> ({hint})</span>}
        </label>
    )
}

interface TextFieldProps extends LabelParts {
    id: string
    value: string
    onChange: (value: string) => void
    type?: "text" | "email" | "tel"
    autoComplete?: string
}

export function TextField({ id, label, value, onChange, type = "text", required, hint, autoComplete }: TextFieldProps) {
    return (
        <div>
            <FieldLabel htmlFor={id} label={label} required={required} hint={hint} />
            <input
                id={id}
                name={id}
                type={type}
                required={required}
                autoComplete={autoComplete}
                className={INPUT_CLASS}
                value={value}
                onChange={(event) => onChange(event.target.value)}
            />
        </div>
    )
}

interface TextAreaFieldProps extends LabelParts {
    id: string
    value: string
    onChange: (value: string) => void
    rows?: number
}

export function TextAreaField({ id, label, value, onChange, rows = 5, required, hint }: TextAreaFieldProps) {
    return (
        <div>
            <FieldLabel htmlFor={id} label={label} required={required} hint={hint} />
            <textarea
                id={id}
                name={id}
                rows={rows}
                required={required}
                className={INPUT_CLASS}
                value={value}
                onChange={(event) => onChange(event.target.value)}
            />
        </div>
    )
}

interface CheckboxFieldProps {
    id: string
    label: string
    checked: boolean
    onChange: (checked: boolean) => void
    required?: boolean
}

export function CheckboxField({ id, label, checked, onChange, required }: CheckboxFieldProps) {
    return (
        <div className="flex items-start gap-3">
            <input
                id={id}
                name={id}
                type="checkbox"
                required={required}
                className="mt-1 h-4 w-4 shrink-0 accent-frtRed"
                checked={checked}
                onChange={(event) => onChange(event.target.checked)}
            />
            <label htmlFor={id} className="text-sm text-gray-300">
                {label}
                {required && " *"}
            </label>
        </div>
    )
}

interface HoneypotFieldProps {
    value: string
    onChange: (value: string) => void
}

/** Csapda mező botoknak — valódi látogató nem látja és nem tölti ki. */
export function HoneypotField({ value, onChange }: HoneypotFieldProps) {
    return (
        <div className="hidden" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input
                id="website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={value}
                onChange={(event) => onChange(event.target.value)}
            />
        </div>
    )
}
