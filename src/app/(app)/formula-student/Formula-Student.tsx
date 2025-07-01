"use client";
import React from "react";
import PageTitle from "@/components/PageTitle";
import PageSubtitle from "@/components/PageSubtitle";
import Image from "next/image";
import { PageProps, pageItems } from "./pageContent";



export default function Page({lang } : PageProps) {
    return (
        <main className = "bg-black text-white min-h-screen selection:bg-red-700 leading-loose pt-14 font-frtszoveg">
            <div className="max-w-5xl mx-auto"><PageTitle title={lang === "hu" ? pageItems[0].title : pageItems[0].titleEng}/></div>
            {/* Responsive YouTube video embed */}
            <div className="w-full flex justify-center mb-8">
                <div className="relative w-full max-w-5xl" style={{ paddingTop: '40%' }}>
                    <iframe
                        src="https://www.youtube.com/embed/kHkAc4df6dc?autoplay=1&mute=1&controls=0&showinfo=0&modestbranding=1&rel=0&loop=1&playlist=kHkAc4df6dc"
                        title=" "
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
                        tabIndex={-1}
                    ></iframe>
                    <noscript>
                        <div className="bg-gray-900 text-white p-4 rounded-xl border-2 border-gray-700 text-center">
                            <p>Video cannot be displayed. <a href="https://www.youtube.com/watch?v=kHkAc4df6dc" target="_blank" rel="noopener noreferrer" className="underline text-blue-400">Watch on YouTube</a></p>
                        </div>
                    </noscript>
                </div>
            </div>

            {pageItems.map((item, idx) => (
                <div key={idx} className="container mx-auto px-4 max-w-5xl">
                        <div className="mx-10">
                            {item.sections.map((section, idx) => (
                                <div key={idx} className="mb-6">
                                    {(lang === "hu" ? section.paragraphs : section.paragraphsEng).map((paragraph, idx) => (
                                        <p key={idx} className="text-m mb-6" dangerouslySetInnerHTML={{ __html: paragraph }} />
                                    ))}
                                    {section.images?.map((image, idx) => (
                                        <Image
                                        key={idx}
                                        src={image.src}
                                        alt={image.alt}
                                        height={image.height}
                                        width={image.width}
                                        className="rounded-2xl mb-6 my-auto max-w-full"
                                        />
                                    ))}       
                                </div>
                            ))}
                        </div>
                

                    {item.subsections?.map((subsection, idx) => (
                        <section key={idx}>
                            <PageSubtitle title={lang === "hu" ? subsection.subTitle ?? "" : subsection.subTitleEng ?? ""} />
                                <div className="mb-6 mx-10">
                                    {(lang === "hu" ? subsection.paragraphs : subsection.paragraphsEng)[0] && (
                                        <p className="text-m mb-6" dangerouslySetInnerHTML={{ __html: subsection.paragraphs[0] }}/>
                                        )}
                                        {subsection.images?.map((image, idx) => (
                                        <Image
                                            key={idx}
                                            src={image.src}
                                            alt={image.alt}
                                            height={image.height}
                                            width={image.width}
                                            className="rounded-2xl mb-6 my-auto max-w-full"
                                        />
                                        ))}
                                    {(lang === "hu" ? subsection.paragraphs : subsection.paragraphsEng).slice(1).map((paragraph, idx) => (
                                        <p key={idx} className="text-m mb-6" dangerouslySetInnerHTML={{ __html: paragraph }}/>
                                    ))}
                                </div>
                        </section>
                    ))}
                </div>
            ))}
            
        </main>);
}