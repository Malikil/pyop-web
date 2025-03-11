"use server";

import { auth } from "@/auth";
import { checkApprover } from "./verifyRoles";
import db from "@/app/api/db/connection";

export async function getPlayer(osuid) {
   const session = await auth();
   const approver = await checkApprover(session.user.id);
   if (!osuid || !approver) osuid = session.user.id;

   const playersCollection = db.collection("players");
   const player = await playersCollection.findOne(
      { osuid: parseInt(osuid) },
      { projection: { _id: 0 } }
   );
   return player;
}
