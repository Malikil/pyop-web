"use server";

import db from "@/app/api/db/connection";

export async function fetchAutofillMaps() {
   return {
      count: 0,
      max: 10
   };
}

export async function addAutofillMap(mapid, mods) {
   console.log(mapid, mods);
}
