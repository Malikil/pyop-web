"use server";

import { auth } from "@/auth";

export async function uploadScreenshot(formData) {
   const session = await auth();
   if (!session) return;
   const data = {
      image: formData.get("image"),
      id: parseInt(formData.get("beatmapId")),
      mods: parseInt(formData.get("mods"))
   };
   console.log(data);
   await new Promise(resolve => setTimeout(resolve, 2000));
}
