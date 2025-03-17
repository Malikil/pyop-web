"use server";

import { convertTime } from "@/time";
import { verify } from "../../functions";
import db from "@/app/api/db/connection";
import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { buildUrl, Client, getEnumMods } from "osu-web.js";

const SHEETS_SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const jwt = new JWT({
   email: process.env.GOOGLE_SHEETS_SERVICE_EMAIL,
   key: process.env.GOOGLE_SHEETS_PRIVATE_KEY,
   scopes: SHEETS_SCOPES
});
const googleSheet = new GoogleSpreadsheet(process.env.GOOGLE_SHEETS_DOCUMENT_ID, jwt);

export async function advancePools() {
   await verify();
   console.log("Advance mappools");

   const result = await db.collection("players").updateMany({}, [
      {
         $set: {
            maps: {
               current: [],
               locked: "$maps.current",
               previous: {
                  $concatArrays: ["$maps.previous", "$maps.current"]
               }
            }
         }
      }
   ]);
   console.log(result);
}

export async function clearScreenshots() {
   await verify();
   console.log("Clear screenshots");
   const playersCollection = db.collection("players");
   const result = await playersCollection.updateMany(
      {},
      {
         $unset: {
            "maps.previous.$[].screenshot": "",
            "maps.locked.$[].screenshot": ""
         }
      }
   );
   console.log(result);
}

export async function exportPools() {
   await verify();
   // Get data from db
   const cursor = db.collection("players").aggregate([
      {
         $match: {
            $or: [{ eliminated: { $exists: false } }, { eliminated: false }]
         }
      },
      { $unwind: "$maps.current" },
      {
         $project: {
            _id: false,
            player: "$osuid",
            mods: "$maps.current.mods",
            map: {
               $concat: [
                  "$maps.current.artist",
                  " - ",
                  "$maps.current.title",
                  " [",
                  "$maps.current.version",
                  "]"
               ]
            },
            stars: { $round: ["$maps.current.stars", 2] },
            bpm: "$maps.current.bpm",
            drain: "$maps.current.drain",
            cs: "$maps.current.cs",
            ar: { $round: ["$maps.current.ar", 1] },
            od: "$maps.current.od",
            mapper: "$maps.current.mapper",
            id: "$maps.current.id"
         }
      },
      {
         $sort: {
            player: 1,
            mods: 1,
            id: 1
         }
      }
   ]);
   const rows = cursor.map(doc => ({
      ...doc,
      player: `=VLOOKUP(${doc.player},PlayerList!A1:B,2,FALSE)`,
      mods: getEnumMods(doc.mods).join("") || "NM",
      drain: convertTime(doc.drain),
      map: `=HYPERLINK("${buildUrl.beatmap(doc.id)}","${doc.map.replace(/"/g, '""')}")`
   }));
   await googleSheet.loadInfo();
   const exportSheet = await googleSheet.addSheet({
      title: `Export ${Date.now()}`,
      headerValues: [
         "player",
         "mods",
         "map",
         "stars",
         "bpm",
         "drain",
         "cs",
         "ar",
         "od",
         "mapper",
         "id"
      ]
   });
   const rowResult = await exportSheet.addRows(await rows.toArray());
   console.log(rowResult[0]);
}

export async function fetchUsernames() {
   const session = await verify();
   const osu = new Client(session.accessToken);
   const playersCollection = db.collection("players");
   const playerList = await playersCollection
      .find(
         { eliminated: { $ne: true }, osuid: { $gt: 1 } },
         { projection: { _id: 0, osuid: 1, osuname: 1 } }
      )
      .toArray();
   const updates = [];
   for (let i = 0; i < playerList.length; i += 50) {
      const batch = playerList.slice(i, i + 50);
      console.log(`Fetching players ${i + 1} to ${i + batch.length}`);
      const users = await osu.users.getUsers({ query: { ids: batch.map(u => u.osuid) } });
      users.forEach(user => {
         const old = batch.find(u => u.osuid === user.id);
         if (old.osuname !== user.username)
            updates.push({
               updateOne: {
                  filter: { osuid: user.id },
                  update: { $set: { osuname: user.username } }
               }
            });
      });
   }

   const result = await playersCollection.bulkWrite(updates);
   console.log(result);
}

export async function pruneAutofill() {
   await verify();

   const requirements = await db.collection("requirements").findOne();
   const autofillCollection = db.collection("autofill");
   return autofillCollection.deleteMany({ stars: { $lt: requirements.maps.stars.min } });
}

export async function autofillMaps() {
   await verify();

   const autofillCollection = db.collection("autofill");
   const autofillList = autofillCollection.find({}, { projection: { _id: 0 } });
   const maps = {
      nm: [],
      hd: [],
      hr: [],
      dt: [],
      other: []
   };
   for await (const map of autofillList) {
      switch (map.mods) {
         case 0:
            maps.nm.push(map);
            break;
         case ModsEnum.HD:
            maps.hd.push(map);
            break;
         case ModsEnum.HR:
            maps.hr.push(map);
            break;
         case ModsEnum.DT:
            maps.dt.push(map);
            break;
         default:
            maps.other.push(map);
      }
   }

   const playersCollection = db.collection("players");
   const playerList = playersCollection.find({
      eliminated: { $ne: true },
      admin: { $ne: true },
      approver: { $ne: true }
   });

   for await (const player of playerList) {
   }

   return [];
}
