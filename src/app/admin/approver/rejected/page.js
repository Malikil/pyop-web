import { ModsEnum } from "osu-web.js";
import { redirect } from "next/navigation";
import MapList from "@/components/mappool/MapList";
import db from "@/app/api/db/connection";
import { checkApprover } from "@/app/admin/approver/actions";
import { auth } from "@/auth";

export default async function RejectedList() {
   const session = await auth();
   if (!session || !(await checkApprover(session.user.id))) redirect("/");
   const playersCollection = db.collection("players");
   const playersWithRejectedMaps = playersCollection.find(
      { "maps.current.approval": "rejected" },
      { projection: { _id: 0, "maps.current.screenshot": 0 } }
   );
   const maps = {
      nm: [],
      hd: [],
      hr: [],
      dt: [],
      other: []
   };
   for await (const player of playersWithRejectedMaps) {
      player.maps.current
         .filter(m => m.approval === "rejected")
         .forEach(map => {
            {
               switch (map.mods) {
                  case 0:
                     maps.nm.push({
                        ...map,
                        pickerId: player.osuid
                     });
                     break;
                  case ModsEnum.HD:
                     maps.hd.push({
                        ...map,
                        pickerId: player.osuid
                     });
                     break;
                  case ModsEnum.HR:
                     maps.hr.push({
                        ...map,
                        pickerId: player.osuid
                     });
                     break;
                  case ModsEnum.DT:
                     maps.dt.push({
                        ...map,
                        pickerId: player.osuid
                     });
                     break;
                  default:
                     maps.other.push({
                        ...map,
                        pickerId: player.osuid
                     });
               }
            }
         });
   }

   return (
      <MapList
         maps={maps}
         mapActions={[
            {
               action: async beatmap => {
                  "use server";

                  redirect(`/mappool/${beatmap.pickerId}`);
               },
               title: "View pool"
            }
         ]}
      />
   );
}
