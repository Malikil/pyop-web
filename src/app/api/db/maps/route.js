import { auth } from "@/auth";
import db from "../connection";
import { NextResponse } from "next/server";
import { calcModStat, Client, ModsEnum } from "osu-web.js";

/**
 * @param {import('next/server').NextRequest} req
 */
export const POST = async req => {
   const session = await auth();
   const { mapid, mods } = await req.json();
   console.log(`${session.user.name} adds map ${mapid} with mods ${mods}`);

   // Get beatmap info
   const osuapi = new Client(session.accessToken);
   try {
      const beatmap = await osuapi.beatmaps.getBeatmap(mapid);
      if (mods !== 0) {
         const attributes = await osuapi.beatmaps.getBeatmapAttributes(mapid, "osu", {
            body: { mods }
         });
         // Update the stats to the appropriate mod
         // Attributes includes star rating and approach rate
         beatmap.difficulty_rating = attributes.star_rating;
         beatmap.ar = attributes.approach_rate;
         // CS needs to be calculated manually
         // Only HR and EZ affect CS
         if (mods & ModsEnum.HR) beatmap.cs = calcModStat.hr.cs(beatmap.cs);
         else if (mods & ModsEnum.EZ) beatmap.cs = calcModStat.ez.cs(beatmap.cs);
         // BPM/Length needs to be calculated for DT/EZ
         if (mods & ModsEnum.DT) {
            beatmap.bpm = calcModStat.dt.bpm(beatmap.bpm);
            beatmap.total_length = calcModStat.dt.length(beatmap.total_length);
            beatmap.hit_length = calcModStat.dt.length(beatmap.hit_length);
         } else if (mods & ModsEnum.EZ) {
            beatmap.bpm = calcModStat.ht.bpm(beatmap.bpm);
            beatmap.total_length = calcModStat.ht.length(beatmap.total_length);
            beatmap.hit_length = calcModStat.ht.length(beatmap.hit_length);
         }
      }
      // Prepare the database object
      const dbBeatmap = {
         id: beatmap.id,
         setid: beatmap.beatmapset_id,
         artist: beatmap.beatmapset.artist_unicode,
         title: beatmap.beatmapset.title_unicode,
         version: beatmap.version,
         length: beatmap.total_length,
         drain: beatmap.hit_length,
         bpm: beatmap.bpm,
         cs: beatmap.cs,
         ar: beatmap.ar,
         stars: beatmap.difficulty_rating,
         mods
      };
      console.log(dbBeatmap);

      const collection = db.collection("players");
      const result = await collection.updateOne(
         { username: session.user.name },
         { $push: { "maps.current": dbBeatmap } }
      );
      console.log(result);
      return NextResponse.json(dbBeatmap);
   } catch (err) {
      console.log(err.response1);
      return new NextResponse(null, { status: err.response1?.status || 500 });
   }
};

/**
 * @param {import('next/server').NextRequest} req
 */
export const DELETE = async req => {
   const session = await auth();
   const params = req.nextUrl.searchParams;
   const mapid = parseInt(params.get("id"));
   const mods = parseInt(params.get("mods"));
   console.log(`${session.user.name} removes map ${mapid} with mods ${mods}`);

   const collection = db.collection("players");
   const result = await collection.bulkWrite([
      {
         updateOne: {
            filter: { "maps.current": { $elemMatch: { id: mapid, mods } } },
            update: { $unset: { "maps.current.$": "" } }
         }
      },
      {
         updateOne: {
            filter: { "maps.current": null },
            update: { $pull: { "maps.current": null } }
         }
      }
   ]);
   console.log(result);
   const player = await collection.findOne({ username: session.user.name });
   if (!player) return new NextResponse(null, { status: 404 });
   return NextResponse.json(player.maps.current);
};
