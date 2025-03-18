"use server";

import db from "@/app/api/db/connection";
import { auth } from "@/auth";
import { checkApprover } from "../actions";
import { calcModStat, Client, ModsEnum } from "osu-web.js";

export async function fetchAutofillMaps() {
   console.log("fetchAutofillMaps");
   const session = await auth();
   if (!session) throw new Error("401");
   if (!(await checkApprover(session.user.id))) throw new Error(`403 - ${session.user.id}`);
   console.log(`${session.user.name} fetches autofill maps`);

   const playersCollection = db.collection("players");
   const playerList = playersCollection.find({
      eliminated: { $ne: true },
      admin: { $ne: true },
      approver: { $ne: true }
   });
   console.log("Fetched from players collection");
   let requiredCount = {
      nm: 0,
      hd: 0,
      hr: 0,
      dt: 0,
      total: 0
   };
   for await (const player of playerList) {
      console.log(player.osuname);
      Object.keys(requiredCount).forEach(k => {
         if (k === "total") requiredCount.total += 10 - player.maps.current.length;
         else
            requiredCount[k] += Math.max(
               0,
               2 -
                  player.maps.current.filter(m => m.mods === (ModsEnum[k.toUpperCase()] || 0))
                     .length
            );
      });
   }
   console.log(requiredCount);

   const autofillList = db.collection("autofill").find({}, { projection: { _id: 0 } });
   console.log("Fetched from autofill collection");
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
   const session = await auth();
   if (!session) throw new Error("401");
   if (!(await checkApprover(session.user.id))) throw new Error(`403 - ${session.user.id}`);
   console.log(`Add map ${mapid} to autofill pool ${mods}`);

   const osuapi = new Client(session.accessToken);
   try {
      const beatmap = await osuapi.beatmaps.getBeatmap(mapid);
      console.log(`Beatmap: ${beatmap.beatmapset.artist} - ${beatmap.beatmapset.title}`);

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
      console.log(Date.parse(beatmap.beatmapset.submitted_date));

      // Check for leaderboard
      let rejectMessage = null;
      if (!beatmap.is_scoreable) {
         // Make sure the mapper isn't in the tournament
         const existingPlayer = await db.collection("players").findOne({
            osuname: beatmap.beatmapset.creator
         });
         if (existingPlayer) rejectMessage = "Mapper is in tournament";
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
         mods
      };
      if (rejectMessage) dbBeatmap.rejection = rejectMessage;
      console.log(dbBeatmap);

      const autofillCollection = db.collection("autofill");
      const result = await autofillCollection.insertOne(dbBeatmap);
      console.log(result);
      return dbBeatmap;
   } catch (err) {
      console.log(err.response1);
      throw new Error("500 - addAutofillMap");
   }
}

export async function removeAutofillMap(mapid, mods) {
   console.log(mapid, mods);
}
