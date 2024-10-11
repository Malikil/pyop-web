import { auth } from "@/auth";
import { db } from "../connection";
import { NextResponse } from "next/server";

export const GET = async () => {
   const session = await auth();
   const collection = db.collection("players");
   const player = await collection.findOne({ username: session.user.name });
   if (!player) return new NextResponse(null, { status: 404 });
   return NextResponse.json(player);
};
