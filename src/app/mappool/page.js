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
         <AddMapButton count={maps.length} token={session.accessToken} />
      </Container>
   );
}
