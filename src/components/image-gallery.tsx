"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

interface GalleryImage {
    id: string
    url: string
    alt?: string
}

interface ImageGalleryProps {
    images: GalleryImage[]
    initialIndex?: number
}

export function ImageGallery({ images, initialIndex = 0 }: ImageGalleryProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(initialIndex)

    const openGallery = (index: number) => {
        setCurrentIndex(index)
        setIsOpen(true)
        document.body.style.overflow = "hidden" // Prevent scrolling when gallery is open
    }

    const closeGallery = () => {
        setIsOpen(false)
        document.body.style.overflow = "" // Restore scrolling
    }

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
    }

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
    }

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (!isOpen) return

            switch (event.key) {
                case "ArrowLeft":
                    goToPrevious()
                    break
                case "ArrowRight":
                    goToNext()
                    break
                case "Escape":
                    closeGallery()
                    break
            }
        },
        [isOpen],
    )

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown)
        return () => {
            window.removeEventListener("keydown", handleKeyDown)
            document.body.style.overflow = "" // Ensure scrolling is restored when component unmounts
        }
    }, [handleKeyDown])

    if (images.length === 0) {
        return null
    }

    return (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-8">
                {images.map((image, index) => (
                    <div
                        key={image.id}
                        className="aspect-[4/3] overflow-hidden bg-gray-900 cursor-pointer"
                        onClick={() => openGallery(index)}
                    >
                        <Image
                            src={image.url || "/placeholder.svg"}
                            alt={image.alt || "Gallery image"}
                            width={300}
                            height={225}
                            className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                ))}
            </div>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
                    <button
                        className="absolute top-4 right-4 text-white hover:text-red-500 transition-colors"
                        onClick={closeGallery}
                        aria-label="Close gallery"
                    >
                        <X size={32} />
                    </button>

                    <button
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-red-500 transition-colors"
                        onClick={goToPrevious}
                        aria-label="Previous image"
                    >
                        <ChevronLeft size={48} />
                    </button>

                    <div className="max-w-4xl max-h-[80vh] relative">
                        <Image
                            src={images[currentIndex].url || "/placeholder.svg"}
                            alt={images[currentIndex].alt || "Gallery image"}
                            width={1200}
                            height={800}
                            className="max-h-[80vh] w-auto object-contain"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-2 text-white text-center">
                            {images[currentIndex].alt && <p>{images[currentIndex].alt}</p>}
                            <p className="text-sm text-gray-300">
                                {currentIndex + 1} / {images.length}
                            </p>
                        </div>
                    </div>

                    <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-red-500 transition-colors"
                        onClick={goToNext}
                        aria-label="Next image"
                    >
                        <ChevronRight size={48} />
                    </button>
                </div>
            )}
        </>
    )
}
