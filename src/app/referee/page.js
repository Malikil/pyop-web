import { auth } from "@/auth";
import MatchInfo from "./components/MatchInfo";
import SetupCommands from "./components/SetupCommands";
import { redirect } from "next/navigation";
import db from "../api/db/connection";

export default async function Referee() {
   const session = await auth();
   if (!session) redirect("/");

   const playersCollection = db.collection("players");
   const playerList = await playersCollection
      .find({}, { projection: { _id: 0, maps: 0 } })
      .toArray();
   const user = playerList.find(p => p.osuid === session.user.id);
   if (!user?.referee && !user?.admin) redirect("/");

   return (
      <div className="d-flex flex-column gap-2">
         <div className="d-flex gap-2">
            <SetupCommands />
         </div>
         <MatchInfo />
      </div>
   );
}
