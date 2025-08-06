import { useState } from "react";
import ScrollArea from "@/components/scrollArea";

interface ComboboxProps {
  listValues?: string[];
  setYear: (year: string) => void;
  lang: string;
}

export default function Combobox({
  listValues = [],
  setYear,
  lang,
}: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);

  function handleSelect(item: string) {
    setYear(item);
    setIsOpen((prevState) => !prevState);
  }

  return (
    <div>
      <div
        onClick={() => setIsOpen((prevState) => !prevState)}
        className="cursor-pointer bg-transparent text-frtRed brightness-150"
      >
        <p className="text-center font-semibold">
          {lang === "en" ? "more..." : "több..."}
        </p>
      </div>

      {isOpen && (
        <ScrollArea className="absolute z-10 bg-frtcardBG brightness-100 rounded-lg overflow-hidden">
          {listValues.map((item, index) => (
            <div key={index} className="cursor-pointer">
              <div onClick={() => handleSelect(item)}>
                <p key={index} className="py-1 text-white text-center">
                  {item}
                </p>
              </div>
            </div>
          ))}
        </ScrollArea>
      )}
    </div>
  );
}

// className="absolute w-[100px] z-10 bg-frtcardBG brightness-200 rounded-lg overflow-hidden"
