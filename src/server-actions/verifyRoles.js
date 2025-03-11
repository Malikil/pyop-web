"use server";

import db from "@/app/api/db/connection";
import { auth } from "@/auth";
import { cache } from "react";

export async function approverAuth() {
   const session = await auth();
   return session && (await checkApprover(session.user.id));
}

export const checkApprover = cache(async osuid => {
   const collection = db.collection("players");
   const player = await collection.findOne({ osuid });
   return player && (player.admin || player.approver);
});
