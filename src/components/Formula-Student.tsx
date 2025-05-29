"use client";
import React from "react";
import PageTitle from "@/components/PageTitle";
import PageSubtitle from "@/components/PageSubtitle";
import Image from "next/image";

type Images = {
    src: string;
    alt: string;
    width: number;
    height: number;
}

type Sections = {
    paragraphs: string[];
    paragraphsEng: string[];
    images?: Images[];
    subsections?: SubSections[];
}

type SubSections = {
    subTitle?: string;
    subTitleEng?: string;
    paragraphs: string[];
    paragraphsEng: string[];
    images?: Images[];
}

type PageItem = {
    title: string;
    titleEng: string;
    sections: Sections[];
    subsections?: SubSections[];
    images?: Images[];
}

const pageItems : PageItem[] = [
    {
        title: "Formula Student",
        titleEng: "Formula Student",
        sections: [
            {
                paragraphs: [
                    "A Formula Student világszerte, egyetemi és főiskolai csapatok számára megrendezett autóversenyek gyűjtőneve, amelyben a hallgatókból álló csapatok együléses versenyautó tervezésben és építésben mérik össze tudásukat. A küzdelem az autó megtervezésén és megépítésén túl, az autó köré felépített teljes üzleti koncepció kidolgozásából, prezentálásából, valamint a projekt működéséhez szükséges anyagi háttér biztosításából áll.",   
                    "A versenysorozat az 1980-as években az Egyesült Államokban jött létre, napjainkban viszont már többek között az Egyesült Királyságban, Németországban, Olaszországban, Brazíliában, a csendes-óceáni régióban és 2010 óta Magyarországon is rendeznek futamokat.",
                    "Nem csupán a hallgatók, hanem a kapcsolódó iparágakban tevékenykedő cégek számára is hasznos a kezdeményezés; a Formula Student révén szorosabb kapcsolat alakulhat ki a munkáltatók és az egyetemekről kikerülő hallgatók között, akik már pályakezdőként is hasznosítható, naprakész ismereteket és tudást szereznek. Az egyetemi versenyek megbecsülését jelzi, hogy az angliai futamot Silverstone-ban, az olaszországi fordulót a Ferrari fioranói pályáján, míg a németországi viadalt a Hockenheimringen rendezik. Az elmúlt években a Formula Student pártfogói között megtalálható volt Ross Brawn, a Forma-1 sportszakmai igazgatója és Mario Theissen, a BMW Motorsport volt igazgatója is."
                ],
                paragraphsEng: [
                    "Formula Student is a brand name for races held worldwide, where college and university students compete in designing and constructing a race car. The competition includes creating and presenting a comprehensive business concept, and raising funds to run the project.",
                    "The series started off in the USA in the 1980’s, but as of today, races are held, among others, in the UK, Germany, Italy, Brazil and in Asia-Pacific, too. The first race in Hungary was held in 2010.",
                    "Participating in our project is not only useful for the students, but for companies working in related industries as well. Formula Student connects employers with fresh graduates, who finish their studies with valuable, up to date knowledge. Symbolizing the reputation of the series, the races are held at such renowned tracks as Silverstone in Great Britain, Hockenheimring in Germany, or the test track of Ferrari, Fiorano Circuit. In recent years, Formula Student was patronized by household names in vehicle and racing industry, namely Ross Brawn, technical director in Formula One, and Mario Theissen, former director of BMW Motorsport."
                ],
                images: [
                    {
                        src: "/FRT_FormulaStudent1.jpg",
                        alt: "FRT Formula Student Cheer",
                        width: 700,
                        height: 50
                    },
                    
                ]
            }
        ]
    },
    {
        title: "Versenyszámok",
        titleEng: "Race events",
        sections: [
            {
                paragraphs: [
                    "A futamok egy többnapos eseménysorozat keretében kerülnek megrendezésre, melynek első megmérettetése a gépátvétel. Ekkor ellenőrzik a bírák, hogy az autók megfelelnek-e a Formula Student által előírt műszaki és biztonsági szabályoknak. A gépátvétel után következnek a „statikus” és “dinamikus” versenyszámok. A pontszám 40%-át a statikus versenyszámok adják, míg a versenypályán mutatott teljesítmények 60%-os súllyal szerepelnek a végelszámolásnál." 
                ],
                paragraphsEng: [
                    "Several events are held on different days of the competitions, but the first is always the scrutineering, where judges check the compliance of the race car with the safety and technical regulations. Scrutineering is followed by “static” and “dynamic” events. Static events are worth 40% of the total score, while dynamic events account for the remaining 60%."
                ],
                images: [
                    {
                        src: "/FRT_FormulaStudent2.jpg",
                        alt: "FRT Formula Student Car",
                        width: 1000,
                        height: 50
                    },
                ],   
            }
        ],
        
        subsections: [
            {
                subTitle: "Dinamikus versenyszámok",
                subTitleEng: "Dynamic events",
                paragraphs: [
                    "A dinamikus számokban nyílik lehetőség a versenyautónak és pilótáknak a pályán történő megmérettetésére.",
                    "<strong>Gyorsulás:</strong><br/>Főként a motor teljesítményéről és a hajtásláncról ad jellemzést az, hogy milyen gyorsító képességgel rendelkezik a jármű. A feladat egy 75 méter hosszú táv megtétele álló helyzetből indulva a lehető legrövidebb idő alatt. Minden versenyszámhoz tartozik egy szintidő, amelynél lassabb teljesítés esetén csak a minimális 3,5 pont jár.<br/><strong>Pályahossz:</strong> 75 méter / <strong>Szintidő:</strong> 1.5-ször a legjobb idő / <strong>Legjobb csapatok ideje:</strong> 3.2-3.5 mp (75-85 km/h, 1.25-1.5 g)",  
                    "<strong>Skid Pad:</strong><br/>Az autó állandósult állapotbeli kanyarodási képességeit méri ez a szám, mely során egy 8-as alakú pályán kell mindkét irányban két kört megtenni. A versenyszám jó eredménnyel való teljesítéséhez szükséges a jó futómű, megfelelő geometriát biztosító kormánymű, alacsony súlypont és jó gumi. <br/><strong>Pálya szélessége: </strong>3 méter / <strong>Körök belső átmérője:</strong> 15,25 méter",
                    "<strong>Autocross:</strong><br/>Egy rövid, max 1500 méteres pálya, amely maximum 80 m hosszú egyenesekből, állandó sugarú kanyarokból (max 25 m sugár), hajtű kanyarokból, 7,5-12 m bójaközű szlalomból, és egyéb elemekből áll. Ebben a számban már a jármű gyorsító és lassító képessége, illetve kanyarban való viselkedése egyaránt számít. Mivel a sebesség nem túl nagy, a kanyarok pedig kis sugarúak, az autónak minél dinamikusabban kell reagálnia a pilóta mozdulataira<br/><strong>Pálya hossza:</strong> max 1500 méter / <strong>Átlagsebesség:</strong> 40-48 km/h",
                    "<strong>Endurance:</strong><br/>Az autó állóképességének és energiafogyasztásának vizsgálata az utolsó versenyszám, melynek során 22 km-t kell összesen a csapat két pilótájának teljesítenie. A pálya felépítése az autocross versenyéhez hasonló, ugyanazon elemekből épül fel, csupán a szlalom bóják távolsága nagyobb 2-5 méterrel. A szűk pályának köszönhetően az autók nem versenyeznek fej-fej mellett. A versenyszám kritikus része a pilótacsere idejére leállított motor vagy elektronika újraindítása.<br/><strong>Átlagsebesség:</strong> 60-70 km/h / <strong>Maximális sebesség:</strong> kb. 120 km/h",
                    "<strong>Efficiency:</strong><br/>A Formula Student versenysorozat legnagyobb kihívást jelentő versenyszáma, amely során a csapatoknak egy 22 km-es pályát kell teljesíteniük. A pálya felépítése az autocross versenyéhez hasonló, ugyanazon elemekből épül fel, csupán a szlalom bóják távolsága nagyobb 2-5 méterrel. A szűk pályának köszönhetően az autók nem versenyeznek fej-fej mellett. A versenyszám kritikus része a pilótacsere idejére leállított motor vagy elektronika újraindítása.<br/><strong>Átlagsebesség:</strong> 60-70 km/h / <strong>Maximális sebesség:</strong> kb. 120 km/h",
                ],
                paragraphsEng: [
                    "During the dynamic events, the pilots take their car to the track, where both man and machine race against the clock.",
                    "<strong>Acceleration:</strong><br/>One way of describing the performance of the motor and the powertrain is measuring the acceleration of the race car. All vehicles have to travel a distance of 75 meters in the shortest possible time, from a standing start. There is a time limit for each event, above which only the minimum points(3,5) are awarded.<br/><strong>Track length:</strong> 75 meters / <strong>Time limit:</strong> 1.5 times the best time / <strong>Top times:</strong> 3.2-3.5 sec (75-85 km/h, 1.25-1.5 g)",
                    "<strong>Skid Pad:</strong><br/>Skid Pad is an eight-figure racetrack, where cornering capabilities of the race car are measured. The key factors for succeeding in this event are well-designed suspension and steering, low center of gravity and suitable tires.<br/><strong>Track width:</strong> 3 meters / <strong>Inner diameter of circles: </strong>15.25 meters",
                    "<strong>Autocross:</strong> This event is held on a short, maximum 1500m, but usually only around 1000m long track, consisting of max 80 m long straights, constant radius turns, hairpins, slalom with cones 7.5–12 meters apart, and other elements such as decreasing radius turns, chicanes etc. Acceleration, braking and cornering performance are equally important in this event. Since the speed is relatively low, and the corners are tight, it is crucial that the car reacts dynamically to the driver's inputs. <strong>Track length:</strong> Max 1500 meters / <strong>Average speed:</strong> 40-48 km/h<br/><strong>Acceleration:</strong><br/>One way of describing the performance of the motor and the powertrain is measuring the acceleration of the race car. All vehicles have to travel a distance of 75 meters in the shortest possible time, from a standing start. There is a time limit for each event, above which only the minimum points(3.5) are awarded.<br/><strong>Track length",
                    "<strong>Endurance:</strong><br/>During this event, the spotlight is on the durability and fuel/energy consumption of the car. Two pilots have to drive the car for 22 kilometres. The track is similar to the one used for autocross, but the distance between cones is expanded by 2-5 metres. Due to the narrow track, the cars don't race head to head, but if two cars meet, the slower car is shown the blue flag. One of the most critical parts of this event is the driver change, where the engine has to be stopped and restarted. In many cases, the restart is unsuccessful, meaning an early retire for the participating team.<br/><strong>Average speed:</strong> 60-70 km/h / <strong>Top speed:</strong> approx 120 km/h",
                    "<strong>Efficiency:</strong><br/>During the Endurance event, the cars have to complete 22 kilometers, therefore the most important factors are durability and energy consumption. The latter is scored in the Efficiency event, by measuring which team could complete the distance most efficiently regarding average speed and energy/fuel consumption. In case of electric vehicles, scoring is based on used energy and runtime. Energy recovered with regenerative braking has a 0.9 multiplier, and is deducted from the used energy. Efficiency scores are only awarded to teams that could complete the endurance event."
                ],
            },
            {
                subTitle: "Statikus versenyszámok",
                subTitleEng: "Static events",
                paragraphs: [
                    "A statikus versenyszámok sokfélesége a minden területre kiterjedő elméleti felkészültséget hivatott ellenőrizni. Így teszik a bírák próbára a csapat műszaki, gazdasági, üzleti felkészültségét.",
                    "<strong>Üzleti terv:</strong><br/>Egy tízperces prezentációban kell bemutatni egy fiktív „virtuális vállalkozást”, melynek terméke a formula versenyautó. Az üzleti tervvel meg kell győzni a zsűrit, mint befektetőt, hogy a csapat által kínált terméket válassza. A prezentáció után a zsűri kérdéseket tesz fel, amelyre az adott válaszok fejében pontokat adnak.",
                    "<strong>Költségelemzés:</strong><br/>Az előre elkészített költségelemzés során részletesen le kell írni, és számlákkal igazolni kell az alkatrészek beszerzési forrását, árát, továbbá a teljes gyártás költségét tételesen, alkatrészekre lebontva.",
                    "<strong>Műszaki tervezés:</strong><br/>A tervezést összefoglaló műszaki dokumentációt, nem csak előzetesen kell a bírák számára elküldeni, hanem a helyszínen, az autó mellett lebonyolított, szóbeli beszélgetés is részét képezi a műszaki tervezésnek. A zsűri kérdéseivel a tervezés alaposságát, a tervezői döntések meghozatalának megfontoltságát firtatja."
                ],
                paragraphsEng: [
                    "The variety of static events allow the judges to test the theoretical knowledge of teams in multiple disciplines, including technical, economical and business areas.",
                    "<strong>Business Plan:<strong/><br/>All teams have a business idea for a company with their race car as the main product. Judges play the role of potential investors, and the teams have to convince them to invest in their start-up. After each presentation, there is a Q&A session, and judges rate the teams by their practicality, organisational and presentational skills.",
                    "<strong>Cost Report:<strong/><br/>Teams have to send a cost report to the judges of each race in advance.The cost of purchasing and manufacturing has to be listed for each part, with invoices serving as proof.",
                    "<strong>Design:<strong/><br/>Some of the documents that have to be sent in advance to the judges summarize the design of the car’s parts, but the majority of the available points in this event are awarded during a discussion with the judges at the pits, next to the car. Judges inspect the thoroughness of design decisions made by the team."
                ],
                images: [
                     {
                        src: "/FRT_FormulaStudent3.jpg",
                        alt: "FRT Formula Student Team",
                        width: 1000,
                        height: 50
                    },
                ],
            }
        ]   
    }
]

export default function Page() {
    return (
        <div className = "bg-black flex flex-col text-white gap-8 min-h-screen justify-between items-center selection:bg-red-700 selection:text-white leading-loose">
            {pageItems.map((item, idx) => (
                <div key={idx} className="md:w-1/2 font-frtszoveg">
                    <PageTitle title={item.title} />
                    <div className="pl-10 pr-10">
                        <div className="gap-6">
                            {item.sections.map((section, idx) => (
                                <div key={idx} className="mb-6">
                                    {section.paragraphs.map((paragraph, idx) => (
                                        <p key={idx} className="text-m mb-6" dangerouslySetInnerHTML={{ __html: paragraph }} />
                                    ))}
                                    {section.images?.map((image, idx) => (
                                        <Image
                                        key={idx}
                                        src={image.src}
                                        alt={image.alt}
                                        height={image.height}
                                        width={image.width}
                                        className="h-auto w-auto rounded-2xl mb-6"
                                        />
                                    ))}       
                                </div>
                            ))}
                        </div>
                    </div>
                    {item.subsections?.map((subsection, idx) => (
                        <div key={idx}>
                            <PageSubtitle title={subsection.subTitle ?? ""} />
                            <div className="pl-10 pr-10">
                                <div className="mb-6">
                                    {subsection.paragraphs[0] && (
                                        <p className="text-m mb-6" dangerouslySetInnerHTML={{ __html: subsection.paragraphs[0] }}/>
                                        )}
                                        {subsection.images?.map((image, idx) => (
                                        <Image
                                            key={idx}
                                            src={image.src}
                                            alt={image.alt}
                                            height={image.height}
                                            width={image.width}
                                            className="h-auto w-auto rounded-2xl mb-6"
                                        />
                                        ))}
                                    {subsection.paragraphs.slice(1).map((paragraph, idx) => (
                                        <p key={idx} className="text-m mb-6" dangerouslySetInnerHTML={{ __html: paragraph }}/>
                                    ))}
                                </div>
                            </div>
                        </div>
                        ))}
                </div>
            ))}
        </div>);
}