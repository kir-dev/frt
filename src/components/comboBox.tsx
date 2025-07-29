import { useState } from "react";

interface ComboboxProps {
  listValues?: string[];
  setYear: (year: string) => void;
}

export default function Combobox({ listValues = [], setYear }: ComboboxProps) {
  const [value, setValue] = useState<string>(
    new Date().getFullYear().toString(),
  );
  const [isOpen, setIsOpen] = useState(false);

  function handleSelect(item: string) {
    setValue(item);
    setYear(item);
    setIsOpen((prevState) => !prevState);
  }

  return (
    <div>
      <div
        onClick={() => setIsOpen((prevState) => !prevState)}
        className="cursor-pointer bg-frtcardBG w-[100px] py-1 rounded-lg hover:scale-105"
      >
        <p className="text-center font-semibold">{value}</p>
      </div>

      {isOpen && (
        <div className="absolute w-[100px] z-10 bg-frtcardBG brightness-200 rounded-lg overflow-hidden">
          {listValues.map((item, index) => (
            <div key={index} className="cursor-pointer">
              <div onClick={() => handleSelect(item)}>
                <p key={index} className="py-1 text-white text-center">
                  {item}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
