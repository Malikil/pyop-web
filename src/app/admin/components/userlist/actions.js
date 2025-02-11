"use server";

import db from "@/app/api/db/connection";
import { verify } from "../../functions";

export async function updateStatus(user, type, status) {
   await verify();

   console.log(type, status);
   const playersCollection = db.collection("players");
   const result = await playersCollection.updateOne({ osuid: user }, { $set: { [type]: status } });
   console.log(result);
}
