import db from "@/app/api/db/connection";
import { auth } from "@/auth";
import MapList from "@/components/mappool/MapList";
import { redirect } from "next/navigation";
import { ModsEnum } from "osu-web.js";
import { createApprovalFunc } from "./actions";

export default async function ApproverPage() {
   const session = await auth();
   if (!session) redirect("/");

   const playersCollection = db.collection("players");
   const user = await playersCollection.findOne({ osuid: session.user.id });
   if (!user || !(user.approver || user.admin)) redirect("/");

   // Get the list of maps
   const mapCursor = playersCollection.aggregate([
      {
         $match: {
            "maps.current.approval": "pending"
         }
      },
      { $unwind: "$maps.current" },
      {
         $match: {
            "maps.current.approval": "pending"
         }
      },
      {
         $project: {
            _id: 0,
            map: "$maps.current"
         }
      }
   ]);
   const maps = {
      nm: [],
      hd: [],
      hr: [],
      dt: [],
      other: []
   };
   for await (const map of mapCursor)
      switch (map.map.mods) {
         case 0:
            maps.nm.push(map.map);
            break;
         case ModsEnum.HD:
            maps.hd.push(map.map);
            break;
         case ModsEnum.HR:
            maps.hr.push(map.map);
            break;
         case ModsEnum.DT:
            maps.dt.push(map.map);
            break;
         default:
            maps.other.push(map.map);
      }

   return (
      <div>
         <MapList
            maps={maps}
            mapActions={[
               { title: "Approve", action: createApprovalFunc("approved") },
               { title: "Reject", action: createApprovalFunc("rejected") }
            ]}
         />
      </div>
   );
}
