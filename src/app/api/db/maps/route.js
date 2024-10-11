import { auth } from "@/auth";
import { db } from "../connection";
import { NextResponse } from "next/server";

/**
 * @param {import('next/server').NextRequest} req
 */
export const POST = async req => {
   const session = await auth();
   console.log(session);
   const collection = db.collection("players");
   console.log(await req.json());
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
