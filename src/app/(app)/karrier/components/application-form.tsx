"use client"

import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { applicationErrorText, applicationFormTexts } from "../translations"
import type { SelectedPosition } from "../types"
import { CheckboxField, HoneypotField, TextAreaField, TextField } from "./form-field"

interface ApplicationFormProps {
    lang: string
    isEn: boolean
    selectedPosition: SelectedPosition | null
}

type Status = "idle" | "submitting" | "success" | "error"

const EMPTY_FORM = {
    name: "",
    email: "",
    phone: "",
    university: "",
    major: "",
    semester: "",
    groupName: "",
    positionName: "",
    motivation: "",
    consent: false,
    website: "",
}

type FormState = typeof EMPTY_FORM

export default function ApplicationForm({ lang, isEn, selectedPosition }: ApplicationFormProps) {
    const [form, setForm] = useState<FormState>(EMPTY_FORM)
    const [status, setStatus] = useState<Status>("idle")
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const texts = applicationFormTexts(isEn)

    const setField = <K extends keyof FormState>(field: K) =>
        (value: FormState[K]) => setForm((previous) => ({ ...previous, [field]: value }))

    // A pozíciónál lévő „Jelentkezem erre a pozícióra" gomb tölti ki ezt a két mezőt.
    useEffect(() => {
        if (!selectedPosition) return
        setForm((previous) => ({
            ...previous,
            groupName: selectedPosition.groupName,
            positionName: selectedPosition.positionName,
        }))
    }, [selectedPosition])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setStatus("submitting")
        setErrorMessage(null)

        try {
            const response = await fetch("/api/karrier/jelentkezes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            })

            if (!response.ok) {
                const data = await response.json().catch(() => null)
                setErrorMessage(applicationErrorText(data?.error ?? "SERVER_ERROR", isEn))
                setStatus("error")
                return
            }

            setForm(EMPTY_FORM)
            setStatus("success")
        } catch {
            setErrorMessage(applicationErrorText("SERVER_ERROR", isEn))
            setStatus("error")
        }
    }

    if (status === "success") {
        return (
            <div className="rounded-lg bg-frtcardBG p-8 text-center">
                <CheckCircle2 size={40} className="mx-auto mb-4 text-frtRed" aria-hidden="true" />
                <p className="text-lg">{texts.success}</p>
            </div>
        )
    }

    const isSubmitting = status === "submitting"

    return (
        <div lang={lang} className="rounded-lg bg-frtcardBG p-6 sm:p-8">
            <h2 className="mb-2 text-2xl font-bold">{texts.heading}</h2>
            <p className="mb-6 text-gray-300">{texts.lead}</p>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <HoneypotField value={form.website} onChange={setField("website")} />

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <TextField
                        id="name"
                        label={texts.name}
                        value={form.name}
                        onChange={setField("name")}
                        required
                        autoComplete="name"
                    />
                    <TextField
                        id="email"
                        label={texts.email}
                        type="email"
                        value={form.email}
                        onChange={setField("email")}
                        required
                        autoComplete="email"
                    />
                    <TextField
                        id="phone"
                        label={texts.phone}
                        type="tel"
                        value={form.phone}
                        onChange={setField("phone")}
                        hint={texts.optional}
                        autoComplete="tel"
                    />
                    <TextField
                        id="semester"
                        label={texts.semester}
                        value={form.semester}
                        onChange={setField("semester")}
                        hint={texts.optional}
                    />
                    <TextField
                        id="university"
                        label={texts.university}
                        value={form.university}
                        onChange={setField("university")}
                        hint={texts.optional}
                    />
                    <TextField
                        id="major"
                        label={texts.major}
                        value={form.major}
                        onChange={setField("major")}
                        hint={texts.optional}
                    />
                    <TextField
                        id="groupName"
                        label={texts.group}
                        value={form.groupName}
                        onChange={setField("groupName")}
                    />
                    <TextField
                        id="positionName"
                        label={texts.position}
                        value={form.positionName}
                        onChange={setField("positionName")}
                    />
                </div>

                <TextAreaField
                    id="motivation"
                    label={texts.motivation}
                    value={form.motivation}
                    onChange={setField("motivation")}
                />

                <CheckboxField
                    id="consent"
                    label={texts.consent}
                    checked={form.consent}
                    onChange={setField("consent")}
                    required
                />

                {status === "error" && errorMessage && (
                    <p className="flex items-center gap-2 text-sm text-frtRed" role="alert">
                        <AlertCircle size={18} aria-hidden="true" />
                        {errorMessage}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 rounded-lg bg-frtRed px-6 py-3 font-bold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isSubmitting && <Loader2 size={18} className="animate-spin" aria-hidden="true" />}
                    {isSubmitting ? texts.submitting : texts.submit}
                </button>
            </form>
        </div>
    )
}
