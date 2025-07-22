type Sections = {
    subtitle: string;
    subtitle_eng: string;
    subsection: string;
    subsection_eng: string;
}

type PageItem = {
    title: string;
    title_eng: string;
    moreButtonText: string;
    moreButtonText_eng: string;
    sections: Sections[];
}

export const pageItems : PageItem = {
    title: "Támogasd Csapatunkat",
    title_eng: "Support our Team",
    sections: [
        {
            subtitle: "Kik vagyunk mi?",
            subtitle_eng: "Who we are?",
            subsection: "Mi vagyunk a BME Formula Racing Team – egy lelkes, egyetemistákból álló csapat, akik nem csak álmodoznak versenyautókról, hanem saját kezűleg meg is építik azt. Célunk, hogy minden évben egy saját tervezésű és építésű versenyautót alkossunk, amivel nemzetközi versenyeken vehetünk részt.",
            subsection_eng: "We are the BME Formula Racing Team – a dedicated group of university students who don’t just dream about race cars, but build it with their own hands. Our goal is to design and manufacture a new race car each year, allowing us to compete in international competitions.",
        },
        {
            subtitle: "Miért támogass minket?",
            subsection_eng: "Why support us?",
            subsection: "A projektünk nem csupán egy autóról szól – ez egy komplex mérnöki kihívás, valódi csapatmunka, kreativitás és hatalmas elhivatottság. Minden egyes támogatás közelebb visz minket ahhoz, hogy fejlettebb technológiákkal dolgozhassunk, professzionálisabb autót építhessünk, és méltó módon képviselhessük egyetemünket és hazánkat a világversenyeken.",
            subtitle_eng: "Our project is about more than just building a car – it’s a complex engineering challenge that requires true teamwork, creativity, and deep commitment. Every bit of support brings us closer to working with more advanced technologies, building a more professional vehicle, and proudly representing our university and our country on the global stage.",
        }

    ],
    moreButtonText: "Bővebben a csapatról...",
    moreButtonText_eng: "Learn more about the team..."
}