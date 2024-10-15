"use server";

import db from "../api/db/connection";

/**
 * @param {object} data
 * @param {number} data.osuId
 * @param {string} data.discordId
 */
export async function addPlayer(data) {
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

/**
 * @param {object} data
 * @param {boolean} data.submissionsOpen
 * @param {number} data.minStars
 * @param {number} data.maxStars
 */
export async function saveSubmissionSettings(data) {
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
