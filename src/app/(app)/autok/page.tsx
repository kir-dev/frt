import { getCars } from "@/lib/payload-cms";
import CarsPageClient from "./cars-page-client";

export const metadata = {
  title: "Autók",
  description: "Autóink listája",
};

type CarsPageProps = {
  searchParams?: Promise<Record<string, string>>;
};

export default async function CarsPage(props: CarsPageProps) {
  let lang = "hu";
  if (props?.searchParams) {
    const sp = await props.searchParams;
    lang = sp && "lang" in sp && sp.lang === "en" ? "en" : "hu";
  }
  const cars = await getCars();

  return <CarsPageClient cars={cars} lang={lang} />;
}
