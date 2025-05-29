"use client";
import React from "react";
import PageTitle from "@/components/PageTitle";
import PageSubtitle from "@/components/PageSubtitle";
import Image from "next/image";
import { PageProps, pageItems } from "./pageContent";



export default function Page({lang } : PageProps) {
    return (
        <main className = "bg-black text-white min-h-screen selection:bg-red-700 leading-loose pt-14 font-frtszoveg">
            {pageItems.map((item, idx) => (
                <div key={idx} className="container mx-auto px-4 max-w-5xl">
                    <PageTitle title={lang === "hu" ? item.title : item.titleEng} />
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