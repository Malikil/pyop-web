import { Container } from "react-bootstrap";
import ModPool from "./modpool";
import AddMapButton from "./addmap";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getPlayer } from "@/fetchplayer";
import { ModsEnum } from "osu-web.js";

export default async function Mappool() {
   const session = await auth();
   if (!session) return redirect("/");

   const player = await getPlayer(session.user.name);
   const maps = player.maps.current;
   /*[
      {
         id: 1781960,
         setid: 852544,
         artist: "米津玄師",
         title: "LOSER",
         version: "WINNER",
         length: 240,
         bpm: 121,
         cs: 4.1,
         ar: 9.3,
         stars: 5.47
      },
      {
         id: 4613868,
         setid: 2183434,
         artist: "+kin_",
         title: "Astral Ascension",
         version: "Further",
         length: 144,
         bpm: 160,
         cs: 4,
         ar: 9.3,
         stars: 6.32
      },
      {
         id: 4696634,
         setid: 2216274,
         artist: "QWER",
         title: "ANIMA POWER",
         version: "Not Classic Extra",
         length: 83,
         bpm: 175,
         cs: 4,
         ar: 9.3,
         stars: 5.54
      },
      {
         id: 4606556,
         setid: 2180691,
         artist: "Questbound",
         title: "The Fires Ignite",
         version: "Ardent Conflagration",
         length: 375,
         bpm: 190,
         cs: 4.2,
         ar: 9.8,
         stars: 7.81
      },
      {
         id: 3583475,
         setid: 1746432,
         artist: "Daft Punk",
         title: "Crescendolls",
         version: "Discovery",
         length: 205,
         bpm: 124.08,
         cs: 4,
         ar: 9,
         stars: 5.32
      }
   ]; //*/
   return (
      <Container className="py-2">
         <div className="d-flex flex-column gap-4">
            <ModPool mod="NoMod" maps={maps.filter(m => !m.mods)} minCount={2} />
            <ModPool mod="Hidden" maps={maps.filter(m => m.mods === ModsEnum.HD)} minCount={2} />
            <ModPool mod="Hard Rock" maps={maps.filter(m => m.mods === ModsEnum.HR)} minCount={2} />
            <ModPool
               mod="Double Time"
               maps={maps.filter(m => m.mods === ModsEnum.DT)}
               minCount={2}
            />
         </div>
         <AddMapButton count={maps.length} />
      </Container>
   );
}
