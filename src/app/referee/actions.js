"use server";

import { auth } from "@/auth";
import { cache } from "react";
import db from "../api/db/connection";

const checkReferee = cache(async osuid => {
   const collection = db.collection("players");
   const player = await collection.findOne({ osuid });
   return player && (player.admin || player.referee);
});

export async function fetchPlayerList() {
   const session = await auth();
   if (!session) throw new Error("401");
   if (!(await checkReferee(session.user.id))) throw new Error(`403 - ${session.user.id}`);

   const playersCollection = db.collection("players");
   const playerList = Object.fromEntries(
      await playersCollection
         .find(
            {
               eliminated: { $ne: true },
               "maps.locked.0": { $exists: true }
            },
            {
               projection: {
                  _id: 0,
                  "maps.locked.screenshot": 0
               }
            }
         )
         .map(p => [p.osuname || p.osuid, p.maps.locked.sort((a, b) => a.mods - b.mods)])
         .toArray()
   );

   return playerList;
}