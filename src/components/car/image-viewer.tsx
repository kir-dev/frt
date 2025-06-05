"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Media } from "@/payload-types";
import Image from "next/image";

interface Props {
  images: Media[];
  closeAction: () => void;
}

export const ImageViewer = ({ images, closeAction }: Props) => {
  const [index, setIndex] = useState<number>(1);
  const [carouselImages, setCarouselImages] = useState<Media[]>([]);
  const [movingRight, setMovingRight] = useState<boolean>(true);

  useEffect(() => {
    window.document.body.setAttribute("class", "overflow-hidden");

    return () => {
      window.document.body.setAttribute("class", "overflow-scroll");
    };
  }, []);

  useEffect(() => {
    if (images.length < 2) {
      images.push(images[0]);
    }
    const first = images[0];
    const second = images[1];
    const last = images[images.length - 1];
    const modifiedImages = [last, ...images, first, second];
    setCarouselImages(modifiedImages);
  }, [images]);

  const adjustIndex = useCallback(
    (value: number) => {
      if (value === carouselImages.length - 1) {
        setIndex(1);
        setTimeout(() => setIndex(2), 100);
        return;
      }
      if (value === 0) {
        setIndex(carouselImages.length - 2);
        setTimeout(() => setIndex(carouselImages.length - 3), 100);
        return;
      }
      setIndex(value);
    },
    [carouselImages.length],
  );

  const increaseIndex = useCallback(() => {
    setMovingRight(true);
    adjustIndex(index + 1);
  }, [adjustIndex, index]);

  const decreaseIndex = useCallback(() => {
    setMovingRight(false);
    adjustIndex(index - 1);
  }, [adjustIndex, index]);

  const handleKeyboardInput = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeAction();
      } else if (e.key === "ArrowLeft") {
        decreaseIndex();
      } else if (e.key === "ArrowRight") {
        increaseIndex();
      }
    },
    [closeAction, decreaseIndex, increaseIndex],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyboardInput);
    return () => {
      document.removeEventListener("keydown", handleKeyboardInput);
    };
  }, [closeAction, decreaseIndex, handleKeyboardInput, increaseIndex]);

  function transitionNeeded() {
    return (
      (index === 1 && movingRight) ||
      (index === carouselImages.length - 2 && !movingRight)
    );
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center tra bg-black/85 nsition-opacity duration-300">
      <div className="relative w-full h-fit overflow-hidden px-[5%] ">
        <div className="absolute left-0 top-0 bottom-0 right-0 flex justify-between items-center px-0 md:px-20 z-20 pointer-events-none">
          <Button
            className="bg-transparent pointer-events-auto"
            onClick={decreaseIndex}
          >
            {"<"}
          </Button>
          <Button
            className="bg-transparent pointer-events-auto"
            onClick={increaseIndex}
          >
            {">"}
          </Button>
        </div>

        <div
          style={{ transform: `translateX(${index * -100}%)` }}
          className={`flex flex-nowrap w-fit  ${transitionNeeded() ? "transition-none" : "transition-all"}`}
        >
          {carouselImages.map((image, currentIndex) => (
            <div
              key={currentIndex}
              className={`min-w-full min-h-full ${transitionNeeded() ? "transition-none" : "transition-all"}  ${index === currentIndex ? "md:scale-[80%] z-10" : ` md:scale-[30%] opacity-0 md:opacity-50 ${currentIndex != index - 1 ? " -translate-x-[60%]" : "translate-x-[60%]"}`}`}
            >
              <Image
                src={image.url || ""}
                alt={image.alt || "Car image"}
                width={1200}
                height={1200}
                className="rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer mx-auto"
              />
            </div>
          ))}
        </div>
      </div>
      <Button
        onClick={closeAction}
        className="absolute top-4 right-4 bg-frtRed hover:bg-red-700 text-white"
      >
        X
      </Button>
    </div>,
    document.body,
  );
};
