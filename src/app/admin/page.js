import { auth } from "@/auth";
import db from "../api/db/connection";
import { redirect } from "next/navigation";

export default async function Admin() {
   const session = await auth();
   if (!session) redirect("/");

   const playersCollection = db.collection("players");
   const user = await playersCollection.findOne({ osuid: session.user.id });
   if (!user?.osuid) redirect("/");

   return <div>Admin content</div>;
}
