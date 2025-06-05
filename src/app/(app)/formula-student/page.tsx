import FormulaStudent from "@/app/(app)/formula-student/Formula-Student";
export default async function FormulaStudentPage(props: { searchParams?: Promise<Record<string, string>> }) {

    let lang: "hu" | "en" = 'hu';
    if (props?.searchParams) {
        const param = await props.searchParams;
        lang = param && 'lang' in param && param.lang === 'en' ? 'en' : 'hu';
    }

    return(
        <FormulaStudent lang={ lang }/>
    );
}   