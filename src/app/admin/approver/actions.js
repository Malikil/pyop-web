"use server";

import db from "@/app/api/db/connection";
import { auth } from "@/auth";
import { ModsEnum } from "osu-web.js";
import { cache } from "react";

export const checkApprover = cache(async osuid => {
   const collection = db.collection("players");
   const player = await collection.findOne({ osuid });
   return player && (player.admin || player.approver);
});

export async function getApprovalMaplist() {
   const session = await auth();
   if (!session) throw new Error("401");
   if (!(await checkApprover(session.user.id))) throw new Error(`403 - ${session.user.id}`);

   const collection = db.collection("players");
   const mapCursor = collection.aggregate([
      {
         $match: {
            "maps.current.approval": "pending",
            eliminated: { $ne: true }
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
   for await (const dbobj of mapCursor) {
      const map = dbobj.map;
      if (map.screenshot)
         map.screenshot = {
            data: Array.from(map.screenshot.buffer)
         };
      switch (map.mods) {
         case 0:
            maps.nm.push(map);
            break;
         case ModsEnum.HD:
            maps.hd.push(map);
            break;
         case ModsEnum.HR:
            maps.hr.push(map);
            break;
         case ModsEnum.DT:
            maps.dt.push(map);
            break;
         default:
            maps.other.push(map);
      }
   }

   return maps;
}

export async function updateApproval(beatmap, status, rejection) {
   const session = await auth();
   if (!(await checkApprover(session.user.id))) throw new Error("Not Authorized");

   const $set = {
      "maps.current.$.approval": status
   };
   if (rejection) $set["maps.current.$.rejection"] = rejection;

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
      { $set }
   );
   console.log(result);
   return true;
}

export async function getPlayerList() {
   const playersCollection = db.collection("players");
   const playerList = await playersCollection
      .find(
         {
            eliminated: { $ne: true },
            admin: { $ne: true },
            approver: { $ne: true }
         },
         {
            projection: {
               _id: 0,
               maps: 0
            }
         }
      )
      .toArray();

   return playerList;
}
