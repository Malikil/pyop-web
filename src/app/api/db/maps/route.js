import { auth } from "@/auth";
import { db } from "../connection";
import { NextResponse } from "next/server";
import { Client } from "osu-web.js";

/**
 * @param {import('next/server').NextRequest} req
 */
export const POST = async req => {
   const session = await auth();
   console.log(session);
   const { mapid, mods } = await req.json();
   console.log({ mapid, mods });

   // Get beatmap info
   const osuapi = new Client(session.accessToken);
   try {
      const beatmap = await osuapi.beatmaps.getBeatmap(mapid);
      console.log(beatmap);
   } catch (err) {
      console.log(err);
      console.log(err.response1);
   }

   const collection = db.collection("players");

   //const player = await collection.findOne({ username: session.user.name });
   //if (!player) return new NextResponse().status(404);
   return new NextResponse(null, { status: 200 });
};

/**
 * @param {import('next/server').NextRequest} req
 */
export const DELETE = async req => {
   const session = await auth();
   console.log(session);
   const collection = db.collection("players");
   console.log(req.nextUrl.searchParams);
   const player = await collection.findOne({ username: session.user.name });
   if (!player) return new NextResponse(null, { status: 404 });
   return NextResponse.json(player.maps.current);
};
