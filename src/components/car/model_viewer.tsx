"use client";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Media } from "@/payload-types";
import Image from "next/image";
import { useCallback, useEffect } from "react";

interface Props {
  model: Media;
  closeAction: () => void;
}

export const ModelViewer = ({ model, closeAction }: Props) => {
  useEffect(() => {
    window.document.body.setAttribute("class", "overflow-hidden");

    return () => {
      window.document.body.setAttribute("class", "overflow-scroll");
    };
  }, []);

  const handleKeyboardInput = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeAction();
      }
    },
    [closeAction],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyboardInput);
    return () => {
      document.removeEventListener("keydown", handleKeyboardInput);
    };
  }, [handleKeyboardInput]);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center tra bg-black/85 nsition-opacity duration-300">
      <Button
        onClick={closeAction}
        className="absolute top-4 right-4 bg-frtRed hover:bg-red-700 text-white"
      >
        X
      </Button>
      {/*Todo replace with the actual 3D scene*/}
      <Image
        src={model.url || ""}
        alt={model.alt || "Car image"}
        width={1200}
        height={1200}
        className="rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer mx-auto"
      />
    </div>,
    document.body,
  );
};
