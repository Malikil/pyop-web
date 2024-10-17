import db from "@/app/api/db/connection";
import { auth } from "@/auth";
import { cache } from "react";

const checkApprover = cache(async osuid => {
   const collection = db.collection("players");
   const player = await collection.findOne({ osuid });
   return player && (player.admin || player.approver);
});

export function createApprovalFunc(status) {
   return async beatmap => {
      "use server";
      const session = await auth();
      if (!(await checkApprover(session.user.id))) return null;

      const collection = db.collection("players");
      const result = await collection.updateMany(
         {
            "maps.current": {
               $elemMatch: {
                  id: beatmap.id,
                  mods: beatmap.mods
               }
            }
         },
         {
            $set: {
               "maps.current.$.approval": status
            }
         }
      );
      console.log(result);
      return true;
   };
}
