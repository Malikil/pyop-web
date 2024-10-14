import { auth } from "@/auth";
import db from "../connection";
import { NextResponse } from "next/server";

export const GET = async () => {
   const session = await auth();
   if (!session) return new NextResponse(null, { status: 401 });
   const collection = db.collection("players");
   const player = await collection.findOne({ osuid: session.user.id });
   if (!player) return new NextResponse(null, { status: 404 });
   return NextResponse.json(player);
};
