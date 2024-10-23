import { auth } from "@/auth";
import db from "../connection";
import { NextResponse } from "next/server";

export const GET = async () => {
   const session = await auth();
   if (!session) return new NextResponse(null, { status: 401 });
   const collection = db.collection("players");
   const player = await collection.findOne({ osuid: session.user.id });
   if (!player) return new NextResponse(null, { status: 404 });
   // Convert screenshots to uint8array
   player.maps.current = player.maps.current.map(m => {
      if (!m.screenshot) return m;

      const mapData = { ...m };
      console.log(m.screenshot.buffer);
      return mapData;
   });
   return NextResponse.json(player);
};
