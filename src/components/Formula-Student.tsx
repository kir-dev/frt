"use client";
import React from "react";
import PageTitle from "@/components/PageTitle";
import PageSubtitle from "@/components/PageSubtitle";

export default function Page() {
    return (
        <div>
            <div className = "bg-black flex flex-col md:felx-row text-white gap-8 min-h-screen justify-between items-center selection:bg-red-700 selection:text-white leading-loose font-face">
                <div className="md:w-1/2">
                    <PageTitle title="Formula Student"/>
                    <div className="pl-10 pr-10">
                        <p className = "text-m mb-6">
                            A Formula Student világszerte, egyetemi és főiskolai csapatok számára megrendezett autóversenyek gyűjtőneve, 
                            amelyben a hallgatókból álló csapatok együléses versenyautó tervezésben és építésben mérik össze tudásukat.
                            A küzdelem az autó megtervezésén és megépítésén túl, az autó köré felépített teljes üzleti koncepció kidolgozásából, 
                            prezentálásából, valamint a projekt működéséhez szükséges anyagi háttér biztosításából áll.
                        </p>
                        <p className = "text-m mb-6">A versenysorozat az 1980-as években az Egyesült Államokban jött létre, 
                            napjainkban viszont már többek között az Egyesült Királyságban, Németországban, Olaszországban, Brazíliában, 
                            a csendes-óceáni régióban és 2010 óta Magyarországon is rendeznek futamokat.
                        </p>
                        <p className = "text-m mb-6"> Nem csupán a hallgatók, hanem a kapcsolódó iparágakban tevékenykedő cégek számára is hasznos a kezdeményezés; 
                            a Formula Student révén szorosabb kapcsolat alakulhat ki a munkáltatók és az egyetemekről kikerülő hallgatók között, 
                            akik már pályakezdőként is hasznosítható, naprakész ismereteket és tudást szereznek. 
                            Az egyetemi versenyek megbecsülését jelzi, hogy az angliai futamot Silverstone-ban, az olaszországi fordulót a Ferrari fioranói pályáján, 
                            míg a németországi viadalt a Hockenheimringen rendezik. Az elmúlt években a Formula Student pártfogói között megtalálható volt Ross Brawn, 
                            a Forma-1 sportszakmai igazgatója és Mario Theissen, a BMW Motorsport volt igazgatója is.
                        </p>
                    </div>
                    
                    {/* image */}
                </div>
                <div className="md:w-1/2">
                    <PageTitle title="Versenyszámok"/>
                    <div className="pl-10 pr-10">
                        <p className = "text-m mb-6">
                            A futamok egy többnapos eseménysorozat keretében kerülnek megrendezésre, melynek első megmérettetése a gépátvétel. Ekkor ellenőrzik a bírák, 
                            hogy az autók megfelelnek-e a Formula Student által előírt műszaki és biztonsági szabályoknak.
                            A gépátvétel után következnek a „statikus” és “dinamikus” versenyszámok. A pontszám 40%-át a statikus versenyszámok adják, 
                            míg a versenypályán mutatott teljesítmények 60%-os súllyal szerepelnek a végelszámolásnál.
                        </p>
                        {/* image */}
                    </div>
                    <PageSubtitle title="Dinamikus versenyszámok"/>
                    <div className="pl-10 pr-10">
                        <p className = "text-m mb-6">
                            A dinamikus számokban nyílik lehetőség a versenyautónak és pilótáknak a pályán történő megmérettetésére.
                        </p>
                        {/* image */}
                        <p className = "text- mb-6">
                            <strong>Gyorsulás:</strong><br/>
                            Főként a motor teljesítményéről és a hajtásláncról ad jellemzést az, hogy milyen gyorsító képességgel rendelkezik a jármű. 
                            A feladat egy 75 méter hosszú táv megtétele álló helyzetből indulva a lehető legrövidebb idő alatt. Minden versenyszámhoz tartozik egy szintidő, 
                            amelynél lassabb teljesítés esetén csak a minimális 3,5 pont jár.<br/>
                            <strong>Pályahossz:</strong> 75 méter / <strong>Szintidő:</strong> 1.5-ször a legjobb idő / <strong>Legjobb csapatok ideje:</strong> 3.2-3.5 mp (75-85 km/h, 1.25-1.5 g)
                        </p>
                        <p className = "text-m mb-6">
                            <strong>Skid Pad:</strong><br/>
                            Az autó állandósult állapotbeli kanyarodási képességeit méri ez a szám, mely során egy 8-as alakú pályán kell mindkét irányban két kört megtenni. 
                            A versenyszám jó eredménnyel való teljesítéséhez szükséges a jó futómű, megfelelő geometriát biztosító kormánymű, alacsony súlypont és jó gumi. <br/>
                            <strong>Pálya szélessége: </strong>3 méter / <strong>Körök belső átmérője:</strong> 15,25 méter
                        </p>
                        <p className = "text-m mb-6">
                            <strong>Autocross:</strong><br/>
                            Egy rövid, max 1500 méteres pálya, amely maximum 80 m hosszú egyenesekből, állandó sugarú kanyarokból (max 25 m sugár), hajtű kanyarokból, 
                            7,5-12 m bójaközű szlalomból, és egyéb elemekből áll. Ebben a számban már a jármű gyorsító és lassító képessége, illetve kanyarban való viselkedése egyaránt számít. 
                            Mivel a sebesség nem túl nagy, a kanyarok pedig kis sugarúak, az autónak minél dinamikusabban kell reagálnia a pilóta mozdulataira<br/>
                            <strong>Pálya hossza:</strong> max 1500 méter / <strong>Átlagsebesség:</strong> 40-48 km/h
                        </p>
                        <p>
                            <strong>Endurance:</strong><br/>
                            Az autó állóképességének és energiafogyasztásának vizsgálata az utolsó versenyszám, melynek során 22 km-t kell összesen a csapat két pilótájának teljesítenie. 
                            A pálya felépítése az autocross versenyéhez hasonló, ugyanazon elemekből épül fel, csupán a szlalom bóják távolsága nagyobb 2-5 méterrel. 
                            A szűk pályának köszönhetően az autók nem versenyeznek fej-fej mellett. A versenyszám kritikus része a pilótacsere idejére leállított motor vagy elektronika újraindítása.<br/>
                            <strong>Átlagsebesség:</strong> 60-70 km/h / <strong>Maximális sebesség:</strong> kb. 120 km/h
                        </p>
                        <p className = "text-m mb-6">
                            <strong>Efficiency:</strong><br/>
                            A Formula Student versenysorozat legnagyobb kihívást jelentő versenyszáma, amely során a csapatoknak egy 22 km-es pályát kell teljesíteniük. 
                            A pálya felépítése az autocross versenyéhez hasonló, ugyanazon elemekből épül fel, csupán a szlalom bóják távolsága nagyobb 2-5 méterrel. 
                            A szűk pályának köszönhetően az autók nem versenyeznek fej-fej mellett. A versenyszám kritikus része a pilótacsere idejére leállított motor vagy elektronika újraindítása.<br/>
                            <strong>Átlagsebesség:</strong> 60-70 km/h / <strong>Maximális sebesség:</strong> kb. 120 km/h
                        </p>
                    </div>
                    <PageSubtitle title="Statikus versenyszámok"/>
                    <div className="pl-10 pr-10">
                        <p className = "text-m mb-6">
                            A statikus versenyszámok sokfélesége a minden területre kiterjedő elméleti felkészültséget hivatott ellenőrizni. Így teszik a bírák próbára a csapat műszaki, gazdasági, üzleti felkészültségét.
                        </p>
                        {/* image */}
                        <p className="text-m mb-6">
                            <strong>Üzleti terv:</strong><br/>
                            Egy tízperces prezentációban kell bemutatni egy fiktív „virtuális vállalkozást”, melynek terméke a formula versenyautó. Az üzleti tervvel meg kell győzni a zsűrit, mint befektetőt, 
                            hogy a csapat által kínált terméket válassza. A prezentáció után a zsűri kérdéseket tesz fel, amelyre az adott válaszok fejében pontokat adnak.
                        </p>
                        <p className="text-m mb-6">
                            <strong>Költségelemzés:</strong><br/>
                            Az előre elkészített költségelemzés során részletesen le kell írni, és számlákkal igazolni kell az alkatrészek beszerzési forrását, árát, továbbá a teljes gyártás költségét tételesen, alkatrészekre lebontva.
                        </p>
                        <p className="text-m mb-6">
                            <strong>Műszaki tervezés:</strong><br/> 
                            A tervezést összefoglaló műszaki dokumentációt, nem csak előzetesen kell a bírák számára elküldeni, hanem a helyszínen, az autó mellett lebonyolított, szóbeli beszélgetés is részét képezi a műszaki tervezésnek. 
                            A zsűri kérdéseivel a tervezés alaposságát, a tervezői döntések meghozatalának megfontoltságát firtatja.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}