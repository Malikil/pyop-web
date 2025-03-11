import { auth } from "@/auth";
import { checkApprover } from "./verifyRoles";
import db from "@/app/api/db/connection";
import { calcModStat, Client, LegacyClient, ModesEnum, ModsEnum } from "osu-web.js";

export async function addMap(mapid, mods, osuid) {
   const session = await auth();
   const approver = checkApprover(session.user.id);
   // Only approvers can add for other players
   if (!osuid || !approver) osuid = session.user.id;

   if (!approver) {
      const status = await db.collection("requirements").findOne();
      if (!status.submissionsOpen)
         return { http: { message: "Submissions are closed", status: 400 } };
   }
   console.log(`${session.user.name} adds map ${mapid} with mods ${mods}`);

   // Make sure the player hasn't already used this map previously
   const playersCollection = db.collection("players");
   const player = await playersCollection.findOne({ osuid });
   const prevMaps = player.maps.previous;
   if (prevMaps.some(m => m.id === mapid))
      return { http: { message: "Map already used", status: 409 } };

   // Get beatmap info
   const osuapi = new Client(session.accessToken);
   try {
      const beatmap = await osuapi.beatmaps.getBeatmap(mapid);
      console.log(`Beatmap: ${beatmap.beatmapset.artist} - ${beatmap.beatmapset.title}`);
      // Reject if the gamemode is wrong
      if (beatmap.mode_int !== ModesEnum.osu)
         return { http: { message: "Invalid game mode", status: 400 } };

      if (mods !== 0) {
         const attributes = await osuapi.beatmaps.getBeatmapAttributes(mapid, "osu", {
            body: { mods }
         });
         // Get the map's star rating
         beatmap.difficulty_rating = attributes.star_rating;
         if (mods & ModsEnum.EZ) beatmap.difficulty_rating += 0.5;

         // Do HR/EZ first because effective AR from DT/HT is applied after
         if (mods & ModsEnum.HR) {
            beatmap.ar = calcModStat.hr.ar(beatmap.ar);
            beatmap.cs = calcModStat.hr.cs(beatmap.cs);
         } else if (mods & ModsEnum.EZ) {
            beatmap.ar = calcModStat.ez.ar(beatmap.ar);
            beatmap.cs = calcModStat.ez.cs(beatmap.cs);
         }
         // BPM/Length needs to be calculated for DT/EZ
         if (mods & ModsEnum.DT) {
            beatmap.ar = calcModStat.dt.ar(beatmap.ar);
            beatmap.bpm = calcModStat.dt.bpm(beatmap.bpm);
            beatmap.total_length = calcModStat.dt.length(beatmap.total_length);
            beatmap.hit_length = calcModStat.dt.length(beatmap.hit_length);
         } else if (mods & ModsEnum.HT) {
            beatmap.ar = calcModStat.ht.ar(beatmap.ar);
            beatmap.bpm = calcModStat.ht.bpm(beatmap.bpm);
            // beatmap.total_length = calcModStat.ht.length(beatmap.total_length);
            // beatmap.hit_length = calcModStat.ht.length(beatmap.hit_length);
            beatmap.total_length = (beatmap.total_length * 4) / 3;
            beatmap.hit_length = (beatmap.hit_length * 4) / 3;
         }
         console.log("Updated mod values");
      }
      // Check for leaderboard
      // Don't bother with stars or length, that's addressed within the map list already
      let approval = "pending";
      if (beatmap.is_scoreable) {
         const osuLegacy = new LegacyClient(process.env.OSU_LEGACY_KEY);
         const scoreList = await osuLegacy.getBeatmapScores({
            b: beatmap.id,
            m: "osu",
            limit: 3,
            mods
         });
         // If there are less than 3 scores, accept it anyways if the player themself has one of them
         if (scoreList.length > 2 || scoreList.find(s => s.user_id === osuid))
            approval = "approved";
         console.log(`Auto approve: ${approval}`);
      }

      // Prepare the database object
      const dbBeatmap = {
         id: beatmap.id,
         setid: beatmap.beatmapset_id,
         artist: beatmap.beatmapset.artist,
         title: beatmap.beatmapset.title,
         version: beatmap.version,
         mapper: beatmap.beatmapset.creator,
         length: beatmap.total_length,
         drain: beatmap.hit_length,
         bpm: beatmap.bpm,
         cs: beatmap.cs,
         ar: beatmap.ar,
         od: beatmap.accuracy,
         stars: Math.round(beatmap.difficulty_rating * 100) / 100,
         mods,
         approval
      };
      console.log(dbBeatmap);

      const result = await playersCollection.updateOne(
         { osuid },
         { $push: { "maps.current": dbBeatmap } }
      );
      console.log(result);
      return dbBeatmap;
   } catch (err) {
      console.log(err.response1);
      return { http: { status: err.response1?.status || 500 } };
   }
}

export async function removeMap(mapid, mods, osuid) {
   const session = await auth();
   const approver = checkApprover(session.user.id);
   if (!osuid || !approver) osuid = session.user.id;

   if (!approver) {
      const status = await db.collection("requirements").findOne();
      if (!status.submissionsOpen)
         return { http: { message: "Submissions are closed", status: 400 } };
   }
   console.log(`${session.user.name} removes map ${mapid} with mods ${mods}`);

   const playersCollection = db.collection("players");
   const result = await playersCollection.bulkWrite([
      {
         updateOne: {
            filter: {
               osuid,
               "maps.current": { $elemMatch: { id: mapid, mods } }
            },
            update: { $unset: { "maps.current.$": "" } }
         }
      },
      {
         updateMany: {
            filter: { "maps.current": null },
            update: { $pull: { "maps.current": null } }
         }
      }
   ]);
   console.log(result);
   const player = await playersCollection.findOne({ osuid });
   if (!player) return { http: { status: 404 } };
   return player.maps.current;
}
