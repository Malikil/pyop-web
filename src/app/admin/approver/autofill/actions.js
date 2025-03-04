"use server";

import db from "@/app/api/db/connection";
import { auth } from "@/auth";
import { checkApprover } from "../actions";
import { ModsEnum } from "osu-web.js";

export async function fetchAutofillMaps() {
   const session = await auth();
   if (!session) throw new Error("401");
   if (!(await checkApprover(session.user.id))) throw new Error(`403 - ${session.user.id}`);

   const playersCollection = db.collection("players");
   const playerList = playersCollection.find({
      eliminated: { $ne: true },
      admin: { $ne: true },
      approver: { $ne: true }
   });
   let requiredCount = 0;
   for await (const player of playerList) requiredCount += 10 - player.maps.current.length;

   const autofillList = db.collection("autofill").find({}, { projection: { _id: 0 } });
   const maps = {
      nm: [],
      hd: [],
      hr: [],
      dt: [],
      other: [],
      required: requiredCount
   };
   for await (const map of autofillList) {
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

export async function addAutofillMap(mapid, mods) {
   console.log(mapid, mods);
}
