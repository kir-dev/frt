/**
 * A Karrier oldal szövegei egy helyen. Az oldal a `?lang=en` paraméterrel vált
 * nyelvet, ahogy a többi oldal is.
 */

export const isEnglish = (lang: string) => lang === "en"

export type CareerTexts = ReturnType<typeof careerTexts>
export type ApplicationFormTexts = ReturnType<typeof applicationFormTexts>

export function careerTexts(isEn: boolean) {
    return {
        title: isEn ? "Join our team!" : "Csatlakozz csapatunkhoz!",
        subtitle: isEn ? "Join the team" : "Csatlakozz a csapathoz",
        groups: isEn ? "Groups" : "Csoportok",
        noOpenPositions: isEn
            ? "There are no open positions in this group at the moment."
            : "Jelenleg nincs nyitott pozíció ebben a csoportban.",
        noOpenPositionsShort: isEn ? "No open positions" : "Nincs nyitott pozíció",
        interested: isEn ? "Interested in any of these positions?" : "Érdeklődsz valamelyik pozíció iránt?",
        apply: isEn ? "Apply now!" : "Jelentkezz most!",
        applyForThis: isEn ? "Apply for this position" : "Jelentkezem erre a pozícióra",
        joining: isEn ? "Joining" : "Csatlakozás",
        timeCommitment: isEn ? "Time commitment" : "Időráfordítás",
        subsystem: isEn ? "Subsystem" : "Részegység",
        applicationsClosed: isEn
            ? "Applications are currently closed. Come back soon!"
            : "A jelentkezés jelenleg zárva. Nézz vissza hamarosan!",
        faqTitle: isEn ? "Frequently asked questions" : "Gyakran ismételt kérdések",
        faqLead: isEn
            ? "We have collected the questions that most often come up during recruitment."
            : "Összegyűjtöttük a tagfelvétel során leggyakrabban felmerülő kérdéseket.",
    }
}

/** Magyarul a szám után egyes szám áll, angolul a darabszámtól függ. */
export function openPositionsLabel(count: number, isEn: boolean) {
    return isEn ? `${count} open position${count === 1 ? "" : "s"}` : `${count} nyitott pozíció`
}

export function applicationFormTexts(isEn: boolean) {
    return {
        heading: isEn ? "Application" : "Jelentkezés",
        lead: isEn
            ? "Fill in the form below and we will get back to you by email."
            : "Töltsd ki az alábbi űrlapot, és e-mailben keresünk meg téged.",
        name: isEn ? "Name" : "Név",
        email: isEn ? "Email address" : "E-mail cím",
        phone: isEn ? "Phone number" : "Telefonszám",
        university: isEn ? "University / faculty" : "Egyetem / kar",
        major: isEn ? "Major" : "Szak",
        semester: isEn ? "Semester" : "Hányadik félév",
        group: isEn ? "Group" : "Csoport",
        position: isEn ? "Position" : "Pozíció",
        motivation: isEn ? "Motivation / message" : "Motiváció / üzenet",
        consent: isEn
            ? "I consent to the processing of my personal data for the purpose of the application."
            : "Hozzájárulok a személyes adataim kezeléséhez a jelentkezés elbírálása céljából.",
        optional: isEn ? "optional" : "opcionális",
        submit: isEn ? "Send application" : "Jelentkezés beküldése",
        submitting: isEn ? "Sending…" : "Küldés…",
        success: isEn
            ? "Thank you! We have received your application and will contact you soon."
            : "Köszönjük! Megkaptuk a jelentkezésed, hamarosan keresünk.",
    }
}

/** A szerver hibakódjaihoz tartozó, felhasználónak szóló üzenetek. */
export function applicationErrorText(code: string, isEn: boolean) {
    switch (code) {
        case "FORM_CHANGED":
            return isEn ? "The form has changed. Your answers and file have been kept. Please review the updated questions and submit again." : "Az űrlap közben megváltozott. A válaszaid és a fájlod megmaradtak. Ellenőrizd a frissített kérdéseket, majd küldd be újra."
        case "INVALID_ANSWER":
            return isEn ? "Please check the selected answer." : "Kérlek, ellenőrizd a megadott választ."
        case "ANSWER_TOO_LONG":
            return isEn ? "This answer is too long. Please shorten it." : "Ez a válasz túl hosszú. Kérlek, rövidítsd le."
        case "CV_TOO_LARGE":
        case "BODY_TOO_LARGE":
            return isEn ? "The upload is too large. The PDF may be at most 5 MiB." : "A feltöltés túl nagy. A PDF legfeljebb 5 MiB lehet."
        case "INVALID_CV":
            return isEn ? "Please choose a valid, unencrypted PDF document." : "Kérlek, válassz érvényes, jelszóval nem védett PDF-dokumentumot."
        case "MISSING_FIELDS":
            return isEn
                ? "Please fill in the required fields and accept the data processing consent."
                : "Kérlek, töltsd ki a kötelező mezőket és fogadd el az adatkezelési hozzájárulást."
        case "INVALID_EMAIL":
            return isEn ? "Please enter a valid email address." : "Kérlek, adj meg egy érvényes e-mail címet."
        case "TOO_MANY_REQUESTS":
            return isEn
                ? "Too many submissions. Please try again in a minute."
                : "Túl sok beküldés. Kérlek, próbáld újra egy perc múlva."
        case "APPLICATIONS_CLOSED":
            return isEn ? "Applications are currently closed." : "A jelentkezés jelenleg zárva."
        default:
            return isEn
                ? "Something went wrong. Please try again later."
                : "Valami hiba történt. Kérlek, próbáld újra később."
    }
}
