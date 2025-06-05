import { getCars } from "@/lib/payload-cms";
import { CarSection } from "@/components/car/car-section";

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

  return (
    <main className="bg-black text-white">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {cars.map((car) => (
          <CarSection car={car} key={car.id} lang={lang} />
        ))}
      </div>
    </main>
  );
}
