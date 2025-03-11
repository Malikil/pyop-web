import { Container } from "react-bootstrap";
import { ModsEnum } from "osu-web.js";
import { redirect } from "next/navigation";
import PoolStats from "@/components/mappool/PoolStats";
import MapList from "@/components/mappool/MapList";
import db from "@/app/api/db/connection";
import { checkApprover } from "@/app/admin/approver/actions";
import { auth } from "@/auth";

export default async function Mappool({ params }) {
   const session = await auth();
   if (!session || !(await checkApprover(session.user.id))) redirect("/");
   const playersCollection = db.collection("players");
   const player = await playersCollection.findOne(
      { osuid: parseInt(params.playerid) },
      { projection: { _id: 0, "maps.current.screenshot": 0 } }
   );
   if (!player) redirect("/admin/approver");

   const maps = player.maps.current.reduce(
      (sorted, map) => {
         switch (map.mods) {
            case 0:
               sorted.nm.push(map);
               break;
            case ModsEnum.HD:
               sorted.hd.push(map);
               break;
            case ModsEnum.HR:
               sorted.hr.push(map);
               break;
            case ModsEnum.DT:
               sorted.dt.push(map);
               break;
            default:
               sorted.other.push(map);
         }
         return sorted;
      },
      {
         nm: [],
         hd: [],
         hr: [],
         dt: [],
         other: []
      }
   );

   return (
      <Container className="py-2">
         <h1>Pool for {player.osuname}</h1>
         <MapList maps={maps} />
         <PoolStats maps={player.maps.current} />
      </Container>
   );
}
