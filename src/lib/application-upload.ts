import { PDFDocument } from "pdf-lib"
import { MAX_CV_SIZE } from "./career-form"

export const MAX_APPLICATION_BODY = MAX_CV_SIZE + 256 * 1024
export class ApplicationBodyError extends Error {
    constructor(
        public code: string,
        public status = 400,
    ) {
        super(code)
    }
}
/** Bound actual streamed bytes as well as declared Content-Length before multipart parsing. */
export async function readApplicationBody(
    request: Request,
): Promise<{ body: Record<string, unknown>; cv: File | null }> {
    if (Number(request.headers.get("content-length")) > MAX_APPLICATION_BODY)
        throw new ApplicationBodyError("BODY_TOO_LARGE", 413)
    const reader = request.body?.getReader()
    if (!reader) throw new ApplicationBodyError("INVALID_BODY")
    const chunks: Uint8Array[] = []
    let size = 0
    try {
        while (true) {
            const { value, done } = await reader.read()
            if (done) break
            size += value.byteLength
            if (size > MAX_APPLICATION_BODY) {
                await reader.cancel()
                throw new ApplicationBodyError("BODY_TOO_LARGE", 413)
            }
            chunks.push(value)
        }
    } finally {
        reader.releaseLock()
    }
    const bytes = Buffer.concat(chunks)
    const contentType = request.headers.get("content-type") ?? ""
    try {
        let body: unknown
        let cv: File | null = null
        if (contentType.startsWith("multipart/form-data")) {
            const data = await new Response(bytes, {
                headers: { "Content-Type": contentType },
            }).formData()
            const files = data.getAll("cv")
            if (files.length > 1 || (files[0] && typeof files[0] === "string"))
                throw new ApplicationBodyError("INVALID_CV")
            cv = files[0] instanceof File && files[0].size ? files[0] : null
            const json = data.get("data")
            if (typeof json !== "string")
                throw new ApplicationBodyError("INVALID_BODY")
            body = JSON.parse(json)
        } else if (contentType.startsWith("application/json"))
            body = JSON.parse(bytes.toString("utf8"))
        else throw new ApplicationBodyError("INVALID_BODY", 415)
        if (!body || typeof body !== "object" || Array.isArray(body))
            throw new ApplicationBodyError("INVALID_BODY")
        return { body: body as Record<string, unknown>, cv }
    } catch (error) {
        if (error instanceof ApplicationBodyError) throw error
        throw new ApplicationBodyError("INVALID_BODY")
    }
}
export async function validateCV(file: File): Promise<Buffer> {
    if (file.size > MAX_CV_SIZE)
        throw new ApplicationBodyError("CV_TOO_LARGE", 413)
    if (
        !/\.pdf$/i.test(file.name) ||
        (file.type && file.type !== "application/pdf")
    )
        throw new ApplicationBodyError("INVALID_CV")
    const bytes = Buffer.from(await file.arrayBuffer())
    if (
        bytes.subarray(0, 5).toString() !== "%PDF-" ||
        !bytes.subarray(-1024).includes(Buffer.from("%%EOF"))
    )
        throw new ApplicationBodyError("INVALID_CV")
    try {
        const pdf = await PDFDocument.load(bytes, {
            updateMetadata: false,
            throwOnInvalidObject: true,
        })
        if (pdf.getPageCount() === 0) throw new Error("Empty PDF")
    } catch {
        throw new ApplicationBodyError("INVALID_CV")
    }
    return bytes
}
