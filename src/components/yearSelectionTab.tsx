"use client";
import { useState } from "react";
import Combobox from "@/components/comboBox";

interface TabProps {
  listValues?: string[];
  setYearAction: (year: string) => void;
  lang: string;
}

export default function YearSelectionTab({
  listValues = [],
  setYearAction,
  lang,
}: TabProps) {
  const [value, setValue] = useState<string>(listValues[0]);

  function handleSelect(item: string) {
    setValue(item);
    setYearAction(item);
  }

  const alwaysVisibleYears = listValues?.slice(0, 3);
  const moreSectionYears = listValues?.slice(3);

  return (
    <div className="flex flex-row items-center">
      <div className="flex flex-row">
        {alwaysVisibleYears.map((item, index) => (
          <div
            key={index}
            className={`cursor-pointer rounded-xl text-white mr-4 p-2 py-1  ${
              value === alwaysVisibleYears[index]
                ? "brightness-110 bg-frtcardBG font-bold"
                : ""
            }`}
          >
            <div onClick={() => handleSelect(item)}>
              <p key={index} className="text-[18px] text-white text-center">
                {item}
              </p>
            </div>
          </div>
        ))}
      </div>
      {listValues?.length > 2 && (
        <div onClick={() => setValue("1800")}>
          <Combobox
            setYear={setYearAction}
            listValues={moreSectionYears}
            lang={lang}
          />
        </div>
      )}
    </div>
  );
}
