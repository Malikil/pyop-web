"use server";

import { auth } from "@/auth";
import db from "../api/db/connection";
import { cache } from "react";

const checkAdmin = cache(async osuid => {
   const collection = db.collection("players");
   const player = await collection.findOne({ osuid });
   return player && player.admin;
});
const verify = async () => {
   const session = await auth();
   if (!session || !(await checkAdmin(session.user.id))) throw new Error("401");
   return session;
};

/**
 * @param {object} data
 * @param {number} data.osuId
 * @param {string} data.discordId
 */
export async function addPlayer(data) {
   await verify();
   const playersCollection = db.collection("players");
   const addingPlayer = await playersCollection.findOne({
      $or: [{ osuid: data.osuId }, { discordid: data.discordId }]
   });
   if (addingPlayer) return false;

   await playersCollection.insertOne({
      osuid: data.osuId,
      discordid: data.discordId,
      maps: {
         current: [],
         previous: []
      }
   });
   return true;
}

export async function advancePools() {
   const session = await verify();
   console.log("Advance mappools");

   const result = await db.collection("players").updateMany({}, [
      {
         $set: {
            maps: {
               current: [],
               previous: {
                  $concatArrays: ["$maps.previous", "$maps.current"]
               }
            }
         }
      }
   ]);
   console.log(result);
}

export async function clearScreenshots() {
   const session = await verify();
   console.log("Clear screenshots");
   const playersCollection = db.collection("players");
   const result = await playersCollection.updateMany(
      {},
      {
         $unset: { "maps.previous.$[].screenshot": "" }
      }
   );
   console.log(result);
}

/**
 * @param {object} data
 * @param {boolean} data.submissionsOpen
 * @param {number} data.minStars
 * @param {number} data.maxStars
 */
export async function saveSubmissionSettings(data) {
   await verify();
   const metaCollection = db.collection("requirements");
   const result = await metaCollection.updateOne(
      {},
      {
         $set: {
            submissionsOpen: data.submissionsOpen,
            "maps.stars.min": data.minStars,
            "maps.stars.max": data.maxStars
         }
      }
   );
   return !!result.modifiedCount;
}
