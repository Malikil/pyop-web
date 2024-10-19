"use server";

import { auth } from "@/auth";
import db from "../api/db/connection";

export async function uploadScreenshot(formData) {
   const session = await auth();
   if (!session || !session.user.id) throw new Error("401");
   console.log(`${session.user.name} uploads screenshot`);
   const imageData = formData.get("image");
   console.log(imageData instanceof File);
   console.log(imageData);
   console.log(imageData instanceof Blob);

   const temp = imageData.bytes();
   console.log(temp);

   const data = {
      image: Buffer.from(imageData).toString("base64url"),
      id: parseInt(formData.get("beatmapId")),
      mods: parseInt(formData.get("mods"))
   };
   console.log(data);

   const collection = db.collection("players");
   const result = await collection.findOneAndUpdate(
      {
         osuid: session.user.id,
         "maps.current": {
            $elemMatch: {
               id: data.id,
               mods: data.mods
            }
         }
      },
      {
         $set: {
            "maps.current.$.screenshot": data.image
         }
      },
      { returnDocument: "after" }
   );
   console.log(result.maps.current);
   return result.maps.current;
}
