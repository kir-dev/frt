"use client";

import { Car, Media } from "@/payload-types";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { ImageViewer } from "@/components/car/image-viewer";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { ModelViewer } from "@/components/car/model_viewer";

const ENGLISH = "en";

interface Props {
  car: Car;
  lang: string;
}

export const CarSection = ({ car, lang }: Props) => {
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);
  const [isModelVisible, setIsModelVisible] = useState(false);

  const hidePictureViewer = useCallback(() => {
    setIsImageViewerVisible(false);
  }, []);

  const showPictureViewer = useCallback(() => {
    setIsImageViewerVisible(true);
  }, []);

  const hideModel = useCallback(() => {
    setIsModelVisible(false);
  }, []);

  const showModel = useCallback(() => {
    setIsModelVisible(true);
  }, []);

  return (
    <>
      <section className="my-10 px-4 md:px-8 max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">
          {car.year} - {car.name}
        </h1>

        <div className="prose max-w-none mb-6 text-white">
          <RichText
            data={lang == ENGLISH ? car.description_eng : car.description}
          />
        </div>

        {car.interactive_model && (
          <Button
            onClick={showModel}
            className="border-frtRed border-2 transition-all duration-300 hover:bg-frtRed hover:font-bold"
          >
            {lang == ENGLISH ? "Watch 3D model" : "3D model megtekintése"}
          </Button>
        )}

        <img
          src={(car.image as Media).url || ""}
          alt={(car.image as Media).alt || "Car image"}
          title={lang == ENGLISH ? "Open gallery" : "Galéria megnyitása"}
          onClick={showPictureViewer}
          className="rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer w-full h-fit mb-6"
        />

        {isImageViewerVisible && (
          <ImageViewer
            closeAction={hidePictureViewer}
            images={car.gallery.map((image) => image.image as Media)}
          />
        )}

        {isModelVisible && (
          <ModelViewer
            closeAction={hideModel}
            model={car.interactive_model as Media}
          ></ModelViewer>
        )}
        <hr className="border-frtRed border-2 rounded-full mt-10" />
      </section>
    </>
  );
};
