import { randomUUID } from "node:crypto"
import type { Field } from "payload"
import {
    DEFAULT_QUESTIONS,
    validateQuestions,
    type FormQuestion,
} from "../lib/career-form"

export const careerFormFields: Field[] = [
    {
        name: "formQuestions",
        type: "array",
        label: "Űrlap kérdései",
        maxRows: 50,
        defaultValue: DEFAULT_QUESTIONS,
        labels: { singular: "Kérdés", plural: "Kérdések" },
        admin: {
            components: {
                RowLabel:
                    "/components/payload/FormQuestionRowLabel#FormQuestionRowLabel",
            },
            initCollapsed: true,
            description:
                "Sorrend: húzd a kérdéseket a helyükre. A hozzájárulás mindig a CV után jelenik meg. A név, e-mail és hozzájárulás kötelező. A csoport és pozíció az automatikus kitöltés miatt nem törölhető.",
        },
        validate: (value) =>
            validateQuestions((value ?? DEFAULT_QUESTIONS) as FormQuestion[]),
        fields: [
            {
                name: "key",
                type: "text",
                required: true,
                defaultValue: () => randomUUID(),
                label: "Állandó azonosító",
                admin: { readOnly: true, hidden: true },
            },
            {
                name: "label",
                type: "text",
                required: true,
                maxLength: 500,
                label: "Kérdés (magyar)",
            },
            {
                name: "labelEng",
                type: "text",
                required: true,
                maxLength: 500,
                label: "Kérdés (angol)",
            },
            {
                name: "hint",
                type: "text",
                maxLength: 1000,
                label: "Súgó (magyar)",
            },
            {
                name: "hintEng",
                type: "text",
                maxLength: 1000,
                label: "Súgó (angol)",
            },
            {
                name: "type",
                type: "select",
                required: true,
                defaultValue: "text",
                label: "Válasz típusa",
                options: [
                    { label: "Rövid szöveg", value: "text" },
                    { label: "Hosszú szöveg", value: "textarea" },
                    { label: "Egy választás", value: "select" },
                    { label: "Több választás", value: "multiselect" },
                    { label: "Jelölőnégyzet", value: "checkbox" },
                ],
            },
            {
                name: "required",
                type: "checkbox",
                label: "Kötelező",
                defaultValue: false,
            },
            {
                name: "hidden",
                type: "checkbox",
                label: "Elrejtve",
                defaultValue: false,
            },
            {
                name: "options",
                type: "array",
                label: "Válaszlehetőségek",
                maxRows: 30,
                admin: {
                    condition: (_, data) =>
                        ["select", "multiselect"].includes(data?.type),
                },
                fields: [
                    {
                        name: "key",
                        type: "text",
                        required: true,
                        defaultValue: () => randomUUID(),
                        label: "Állandó azonosító",
                        admin: { readOnly: true, hidden: true },
                    },
                    {
                        name: "label",
                        type: "text",
                        required: true,
                        maxLength: 300,
                        label: "Felirat (magyar)",
                    },
                    {
                        name: "labelEng",
                        type: "text",
                        required: true,
                        maxLength: 300,
                        label: "Felirat (angol)",
                    },
                ],
            },
        ],
    },
]
