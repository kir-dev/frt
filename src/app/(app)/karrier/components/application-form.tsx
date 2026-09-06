"use client"

import { AlertCircle, Loader2, Paperclip, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import {
    MAX_CV_SIZE,
    validateAnswers,
    type Answer,
    type FormConfig,
    type FormQuestion,
} from "@/lib/career-form"
import { applicationErrorText, applicationFormTexts } from "../translations"
import type { SelectedPosition } from "../types"
import { HoneypotField } from "./form-field"
import SuccessCheck from "./success-check"

interface ApplicationFormProps {
    lang: string
    isEn: boolean
    selectedPosition: SelectedPosition | null
    initialConfig: FormConfig
}
const INPUT_CLASS =
    "w-full rounded-lg border border-white/20 bg-black px-4 py-2.5 text-white focus:border-frtRed focus:outline-none focus:ring-1 focus:ring-frtRed"

function Question({
    question: q,
    value,
    onChange,
    isEn,
    error,
}: {
    question: FormQuestion
    value?: Answer
    onChange: (value: Answer) => void
    isEn: boolean
    error: boolean
}) {
    const id = `application-${q.key}`
    const label = isEn ? q.labelEng : q.label
    const hint = isEn ? q.hintEng : q.hint
    const labelContent = (
        <>
            {label}
            {q.required ? (
                " *"
            ) : (
                <span className="font-normal text-gray-400">
                    {" "}
                    ({isEn ? "optional" : "opcionális"})
                </span>
            )}
        </>
    )
    const common = {
        id,
        name: q.key,
        "aria-invalid": error || undefined,
        "aria-describedby": hint ? `${id}-hint` : undefined,
    }
    const onMultiChange = (key: string, checked: boolean) => {
        const selected = Array.isArray(value) ? value : []
        onChange(
            checked ? [...selected, key] : selected.filter((v) => v !== key),
        )
    }
    return (
        <div
            className={
                q.type === "textarea" ||
                q.type === "multiselect" ||
                q.type === "checkbox"
                    ? "sm:col-span-2"
                    : ""
            }
        >
            {q.type === "multiselect" ? (
                <fieldset
                    id={id}
                    tabIndex={-1}
                    aria-invalid={error || undefined}
                    aria-describedby={common["aria-describedby"]}
                >
                    <legend className="mb-2 text-sm font-medium text-gray-200">
                        {labelContent}
                    </legend>
                    <div className="space-y-2">
                        {q.options?.map((option) => (
                            <label
                                key={option.key}
                                className="flex items-center gap-3 text-sm"
                            >
                                <input
                                    type="checkbox"
                                    name={q.key}
                                    value={option.key}
                                    checked={
                                        Array.isArray(value) &&
                                        value.includes(option.key)
                                    }
                                    onChange={(e) =>
                                        onMultiChange(
                                            option.key,
                                            e.target.checked,
                                        )
                                    }
                                    className="h-4 w-4 accent-frtRed"
                                />
                                {isEn ? option.labelEng : option.label}
                            </label>
                        ))}
                    </div>
                </fieldset>
            ) : q.type === "checkbox" ? (
                <label
                    htmlFor={id}
                    className="flex items-start gap-3 text-sm text-gray-200"
                >
                    <input
                        {...common}
                        type="checkbox"
                        required={!!q.required}
                        checked={value === true}
                        onChange={(e) => onChange(e.target.checked)}
                        className="mt-1 h-4 w-4 shrink-0 accent-frtRed"
                    />
                    <span>{labelContent}</span>
                </label>
            ) : (
                <>
                    <label
                        htmlFor={id}
                        className="mb-1.5 block text-sm font-medium text-gray-200"
                    >
                        {labelContent}
                    </label>
                    {q.type === "textarea" ? (
                        <textarea
                            {...common}
                            className={INPUT_CLASS}
                            rows={5}
                            required={!!q.required}
                            value={typeof value === "string" ? value : ""}
                            onChange={(e) => onChange(e.target.value)}
                        />
                    ) : q.type === "select" ? (
                        <select
                            {...common}
                            className={INPUT_CLASS}
                            required={!!q.required}
                            value={typeof value === "string" ? value : ""}
                            onChange={(e) => onChange(e.target.value)}
                        >
                            <option value="">
                                {isEn
                                    ? "Select an option"
                                    : "Válassz egy lehetőséget"}
                            </option>
                            {q.options?.map((option) => (
                                <option key={option.key} value={option.key}>
                                    {isEn ? option.labelEng : option.label}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            {...common}
                            className={INPUT_CLASS}
                            type={
                                q.key === "email"
                                    ? "email"
                                    : q.key === "phone"
                                      ? "tel"
                                      : "text"
                            }
                            autoComplete={
                                q.key === "name"
                                    ? "name"
                                    : q.key === "email"
                                      ? "email"
                                      : q.key === "phone"
                                        ? "tel"
                                        : undefined
                            }
                            required={!!q.required}
                            value={typeof value === "string" ? value : ""}
                            onChange={(e) => onChange(e.target.value)}
                        />
                    )}
                </>
            )}
            {hint && (
                <p id={`${id}-hint`} className="mt-1.5 text-sm text-gray-400">
                    {hint}
                </p>
            )}
        </div>
    )
}

export default function ApplicationForm({
    lang,
    isEn,
    selectedPosition,
    initialConfig,
}: ApplicationFormProps) {
    const [config, setConfig] = useState(initialConfig)
    const [answers, setAnswers] = useState<Record<string, Answer>>({})
    const [website, setWebsite] = useState("")
    const [cv, setCV] = useState<File | null>(null)
    const fileRef = useRef<HTMLInputElement>(null)
    const [status, setStatus] = useState<
        "idle" | "submitting" | "success" | "error"
    >("idle")
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [errorField, setErrorField] = useState<string | undefined>()
    const texts = applicationFormTexts(isEn)
    useEffect(() => {
        if (selectedPosition)
            setAnswers((previous) => ({
                ...previous,
                groupName: selectedPosition.groupName,
                positionName: selectedPosition.positionName,
            }))
    }, [selectedPosition])
    const showError = (code: string, field?: string) => {
        setErrorMessage(applicationErrorText(code, isEn))
        setErrorField(field)
        setStatus("error")
        if (field)
            requestAnimationFrame(() =>
                document.getElementById(`application-${field}`)?.focus(),
            )
    }
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const validated = validateAnswers(answers, config)
        if (!validated.ok) {
            showError(validated.error, validated.field)
            return
        }
        setStatus("submitting")
        setErrorMessage(null)
        setErrorField(undefined)
        const data = new FormData()
        data.set(
            "data",
            JSON.stringify({
                answers,
                website,
                language: lang,
                formVersion: config.version,
            }),
        )
        if (cv) data.set("cv", cv)
        try {
            const response = await fetch("/api/karrier/jelentkezes", {
                method: "POST",
                body: data,
            })
            const result = await response.json().catch(() => null)
            if (!response.ok) {
                if (result?.error === "FORM_CHANGED" && result.config)
                    setConfig(result.config)
                showError(result?.error ?? "SERVER_ERROR", result?.field)
                return
            }
            setAnswers({})
            setCV(null)
            setStatus("success")
        } catch {
            showError("SERVER_ERROR")
        }
    }
    if (status === "success")
        return (
            <div
                className="rounded-lg bg-frtcardBG p-8 text-center"
                role="status"
            >
                <SuccessCheck />
                <p className="text-lg">{texts.success}</p>
            </div>
        )
    const renderQuestion = (q: FormQuestion) => (
        <Question
            key={q.key}
            question={q}
            value={answers[q.key]}
            onChange={(value) =>
                setAnswers((previous) => ({ ...previous, [q.key]: value }))
            }
            isEn={isEn}
            error={errorField === q.key}
        />
    )
    return (
        <div lang={lang} className="rounded-lg bg-frtcardBG p-6 sm:p-8">
            <h2 className="mb-2 text-2xl font-bold">{texts.heading}</h2>
            <p className="mb-6 text-gray-300">{texts.lead}</p>
            <form onSubmit={handleSubmit} noValidate>
                <fieldset
                    disabled={status === "submitting"}
                    className="space-y-5 disabled:opacity-70"
                >
                    <HoneypotField value={website} onChange={setWebsite} />
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        {config.questions
                            .filter((q) => !q.hidden && q.key !== "consent")
                            .map(renderQuestion)}
                    </div>
                    <div>
                        <label
                            htmlFor="application-cv"
                            className="mb-2 flex items-center gap-2 text-sm font-medium"
                        >
                            <Paperclip size={17} aria-hidden />
                            {isEn ? "CV (optional)" : "Önéletrajz (opcionális)"}
                        </label>
                        <p id="cv-help" className="mb-3 text-sm text-gray-400">
                            {isEn
                                ? "One PDF file, up to 5 MiB. Only our administrators can access it."
                                : "Egy PDF-fájl, legfeljebb 5 MiB. Csak az adminisztrátoraink férnek hozzá."}
                        </p>
                        <input
                            ref={fileRef}
                            id="application-cv"
                            name="cv"
                            type="file"
                            accept=".pdf,application/pdf"
                            aria-describedby="cv-help"
                            className="block w-full min-w-0 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-black/50 file:px-4 file:py-2 file:text-white"
                            onChange={(event) => {
                                const file = event.target.files?.[0] ?? null
                                if (
                                    file &&
                                    (file.size > MAX_CV_SIZE ||
                                        !/\.pdf$/i.test(file.name))
                                ) {
                                    setCV(null)
                                    event.target.value = ""
                                    showError(
                                        file.size > MAX_CV_SIZE
                                            ? "CV_TOO_LARGE"
                                            : "INVALID_CV",
                                    )
                                    return
                                }
                                setCV(file)
                            }}
                        />
                        {cv && (
                            <button
                                type="button"
                                onClick={() => {
                                    setCV(null)
                                    if (fileRef.current)
                                        fileRef.current.value = ""
                                }}
                                className="mt-2 inline-flex items-center gap-1 text-sm text-red-300"
                            >
                                <X size={16} aria-hidden />
                                {isEn ? "Remove file" : "Fájl eltávolítása"}
                            </button>
                        )}
                    </div>
                    {config.questions
                        .filter((q) => q.key === "consent")
                        .map(renderQuestion)}
                    {errorMessage && (
                        <p
                            className="flex items-start gap-2 text-sm text-red-300"
                            role="alert"
                        >
                            <AlertCircle
                                size={18}
                                className="shrink-0"
                                aria-hidden
                            />
                            {errorMessage}
                        </p>
                    )}
                    <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-lg bg-frtRed px-6 py-3 font-bold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed"
                        disabled={status === "submitting"}
                    >
                        {status === "submitting" && (
                            <Loader2
                                size={18}
                                className="animate-spin"
                                aria-hidden
                            />
                        )}
                        {status === "submitting"
                            ? texts.submitting
                            : texts.submit}
                    </button>
                </fieldset>
            </form>
        </div>
    )
}
