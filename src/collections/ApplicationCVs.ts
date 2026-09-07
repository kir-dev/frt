import path from "node:path"
import type { CollectionConfig } from "payload"

export const ApplicationCVs: CollectionConfig = {
    slug: "application-cvs",
    labels: { singular: "Önéletrajz", plural: "Önéletrajzok" },
    admin: { hidden: true },
    access: {
        create: () => false,
        read: ({ req }) => !!req.user,
        update: () => false,
        delete: () => false,
    },
    upload: {
        staticDir:
            process.env.CV_STORAGE_DIR ||
            path.resolve(process.cwd(), "private/cvs"),
        mimeTypes: ["application/pdf"],
        modifyResponseHeaders: ({ headers }) => {
            headers.set("Cache-Control", "private, no-store")
            headers.set("X-Content-Type-Options", "nosniff")
            headers.set("Content-Disposition", "attachment")
            return headers
        },
    },
    fields: [],
}
