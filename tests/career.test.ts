import { test } from "node:test"
import assert from "node:assert/strict"
import { PDFDocument } from "pdf-lib"
import {
    DEFAULT_QUESTIONS,
    MAX_CV_SIZE,
    resolveFormConfig,
    validateQuestions,
    validateAnswers,
    summarizeAnswers,
    type FormQuestion,
} from "../src/lib/career-form"
import {
    readApplicationBody,
    validateCV,
    MAX_APPLICATION_BODY,
} from "../src/lib/application-upload"
import { headerUpdate, SHEET_COLUMNS } from "../src/lib/google-sheets"
import { syncApplicationToSheet } from "../src/lib/karrier-sheet-sync"
import type { Payload } from "payload"
import type { JobApplication } from "../src/payload-types"
const answers = {
    name: "Test Applicant",
    email: "test@example.test",
    consent: true,
}
const option = { key: "cad", label: "CAD tervezés", labelEng: "CAD design" }
const custom: FormQuestion = {
    key: "tools",
    label: "Eszközök",
    labelEng: "Tools",
    type: "multiselect",
    required: true,
    options: [option],
}
const config = { version: "v1", questions: [...DEFAULT_QUESTIONS, custom] }

test("mandatory core fields cannot be deleted, hidden or changed to another type", () => {
    for (const key of ["name", "email", "consent"]) {
        assert.notEqual(
            validateQuestions(DEFAULT_QUESTIONS.filter((q) => q.key !== key)),
            true,
        )
        assert.notEqual(
            validateQuestions(
                DEFAULT_QUESTIONS.map((q) =>
                    q.key === key ? { ...q, hidden: true } : q,
                ),
            ),
            true,
        )
    }
    assert.notEqual(
        validateQuestions(
            DEFAULT_QUESTIONS.map((q) =>
                q.key === "email"
                    ? { ...q, type: "select", options: [option] }
                    : q,
            ),
        ),
        true,
    )
    assert.notEqual(
        validateQuestions([...DEFAULT_QUESTIONS, DEFAULT_QUESTIONS[0]]),
        true,
    )
})
test("custom required and choice validation prevents forged values", () => {
    assert.equal(validateAnswers(answers, config).ok, false)
    assert.equal(
        validateAnswers({ ...answers, tools: ["forged"] }, config).ok,
        false,
    )
    assert.equal(
        validateAnswers({ ...answers, tools: "cad" }, config).ok,
        false,
    )
    assert.equal(
        validateAnswers({ ...answers, tools: ["cad"] }, config).ok,
        true,
    )
})
test("checkbox true is valid and missing consent is not", () => {
    assert.equal(validateAnswers(answers, resolveFormConfig()).ok, true)
    assert.equal(
        validateAnswers({ ...answers, consent: "true" }, resolveFormConfig())
            .ok,
        false,
    )
    assert.equal(
        validateAnswers({ ...answers, consent: false }, resolveFormConfig()).ok,
        false,
    )
})
test("hidden optional required fields do not prevent submission; position selection survives", () => {
    const hidden = {
        ...config,
        questions: config.questions.map((q) =>
            q.key === "tools" || q.key === "groupName"
                ? { ...q, hidden: true }
                : q,
        ),
    }
    const result = validateAnswers(
        { ...answers, groupName: "Software" },
        hidden,
    )
    assert.equal(result.ok, true)
    if (result.ok) assert.equal(result.values.groupName, "Software")
})
test("historical labels and option labels remain usable after configuration edits", () => {
    const result = validateAnswers({ ...answers, tools: ["cad"] }, config)
    assert.equal(result.ok, true)
    if (result.ok) {
        const saved = structuredClone(result.snapshots)
        assert.equal(summarizeAnswers(saved, false), "Eszközök: CAD tervezés")
        assert.equal(summarizeAnswers(saved, true), "Tools: CAD design")
    }
})
test("long answers are rejected rather than silently truncated", () => {
    assert.deepEqual(
        validateAnswers(
            { ...answers, name: "x".repeat(121) },
            resolveFormConfig(),
        ),
        { ok: false, error: "ANSWER_TOO_LONG", field: "name" },
    )
})
test("PDF parser accepts a real document and rejects renamed text and malformed PDFs", async () => {
    const pdf = await PDFDocument.create()
    pdf.addPage()
    const bytes = await pdf.save()
    assert.ok(
        (
            await validateCV(
                new File([new Uint8Array(bytes)], "cv.pdf", { type: "application/pdf" }),
            )
        ).length,
    )
    for (const content of ["hello", "%PDF-1.7\nfake\n%%EOF"])
        await assert.rejects(
            validateCV(
                new File([content], "cv.pdf", { type: "application/pdf" }),
            ),
            /INVALID_CV/,
        )
    await assert.rejects(
        validateCV(new File([new Uint8Array(MAX_CV_SIZE + 1)], "large.pdf")),
        /CV_TOO_LARGE/,
    )
})
test("JSON and multipart requests share the same body contract", async () => {
    const json = await readApplicationBody(
        new Request("http://localhost", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(answers),
        }),
    )
    assert.deepEqual(json, { body: answers, cv: null })
    const data = new FormData()
    data.set("data", JSON.stringify(answers))
    data.set("cv", new File(["pdf"], "cv.pdf"))
    const multi = await readApplicationBody(
        new Request("http://localhost", { method: "POST", body: data }),
    )
    assert.deepEqual(multi.body, answers)
    assert.equal(multi.cv?.name, "cv.pdf")
})
test("actual body limit holds even without Content-Length; malformed and duplicate file bodies fail", async () => {
    await assert.rejects(
        readApplicationBody(
            new Request("http://localhost", {
                method: "POST",
                body: "x".repeat(MAX_APPLICATION_BODY + 1),
            }),
        ),
        /BODY_TOO_LARGE/,
    )
    const data = new FormData()
    data.set("data", "{}")
    data.append("cv", new File(["1"], "one.pdf"))
    data.append("cv", new File(["2"], "two.pdf"))
    await assert.rejects(
        readApplicationBody(
            new Request("http://localhost", { method: "POST", body: data }),
        ),
        /INVALID_CV/,
    )
    await assert.rejects(
        readApplicationBody(
            new Request("http://localhost", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: "[]",
            }),
        ),
        /INVALID_BODY/,
    )
})
test("spreadsheet header upgrade preserves legacy columns and refuses foreign columns", () => {
    assert.equal(headerUpdate([])?.range, "A1:L1")
    assert.equal(headerUpdate(SHEET_COLUMNS.slice(0, 10))?.range, "K1:L1")
    assert.equal(headerUpdate([...SHEET_COLUMNS]), null)
    assert.throws(
        () => headerUpdate([...SHEET_COLUMNS.slice(0, 10), "Recruiter notes"]),
        /foglaltak/,
    )
    assert.throws(() => headerUpdate(["Unrelated sheet"]), /eltér/)
})
test("spreadsheet configuration failure never rejects an already saved application", async () => {
    let status = ""
    const fake = {
        findGlobal: async () => {
            throw new Error("Offline")
        },
        update: async ({ data }: { data: { sheetSyncStatus: string } }) => {
            status = data.sheetSyncStatus
        },
        logger: { error: () => {} },
    }
    const result = await syncApplicationToSheet(
        fake as unknown as Payload,
        { id: 1 } as JobApplication,
    )
    assert.equal(result.status, "error")
    assert.equal(status, "error")
})

test("spreadsheet export upgrades a test sheet and appends the complete RAW row", async () => {
    const { generateKeyPairSync } = await import("node:crypto")
    const { appendApplicationRow } = await import("../src/lib/google-sheets")
    const { privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 })
    const previousFetch = globalThis.fetch
    const previousEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
    const previousKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = "test@example.test"
    process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY = privateKey
        .export({ type: "pkcs8", format: "pem" })
        .toString()
    const writes: { url: string; data: { values: string[][] } }[] = []
    globalThis.fetch = async (input, init) => {
        const url = String(input)
        if (url === "https://oauth2.googleapis.com/token")
            return Response.json({
                access_token: "test-only",
                expires_in: 3600,
            })
        assert.ok(
            url.startsWith(
                "https://sheets.googleapis.com/v4/spreadsheets/test-sheet/",
            ),
        )
        if (!init?.method || init.method === "GET")
            return Response.json({ values: [SHEET_COLUMNS.slice(0, 10)] })
        writes.push({ url, data: JSON.parse(String(init.body)) })
        return Response.json({ updates: { updatedRows: 1 } })
    }
    try {
        const result = await appendApplicationRow(
            "https://docs.google.com/spreadsheets/d/test-sheet/edit",
            {
                submittedAt: "now",
                name: "=formula",
                email: "test@example.test",
                phone: "",
                university: "",
                major: "",
                semester: "",
                group: "",
                position: "",
                motivation: "",
                additionalAnswers: "Tools: CAD",
                adminUrl:
                    "https://example.test/admin/collections/job-applications/1",
            },
        )
        assert.equal(result.status, "ok")
        assert.equal(writes.length, 2)
        assert.match(writes[0].url, /K1:L1/)
        assert.match(writes[1].url, /valueInputOption=RAW/)
        assert.equal(writes[1].data.values[0].length, 12)
        assert.equal(writes[1].data.values[0][1], "=formula")
        assert.equal(writes[1].data.values[0][10], "Tools: CAD")
    } finally {
        globalThis.fetch = previousFetch
        if (previousEmail === undefined)
            delete process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
        else process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = previousEmail
        if (previousKey === undefined)
            delete process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
        else process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY = previousKey
    }
})
