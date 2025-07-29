import { useState } from "react";

interface ComboboxProps {
  listValues?: string[];
  setYear: (year: string) => void;
}

export default function Combobox({ listValues = [], setYear }: ComboboxProps) {
  const [value, setValue] = useState<string>(listValues[0]);
  const [isOpen, setIsOpen] = useState(false);

  function handleSelect(item: string) {
    setValue(item);
    setYear(item);
    setIsOpen(true);
  }

  return (
    <>
      <div onClick={() => setIsOpen(true)}>
        <p>{value}</p>
      </div>

      {isOpen && (
        <div className="absolute z-10 bg-frtcardBG rounded-lg overflow-hidden">
          {listValues.map((item, index) => (
            <>
              <div onClick={() => handleSelect(item)}>
                <p key={index} className="py-2 text-white">
                  {item}
                </p>
              </div>
              {listValues.indexOf(item) === listValues.length - 1 ? null : (
                <div className="h-0.2 !bg-white w-full mx-auto"></div>
              )}
            </>
          ))}
        </div>
      )}
    </>
  );
}
