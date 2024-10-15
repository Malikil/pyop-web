import db from "@/app/api/db/connection";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ApproverPage() {
   const session = await auth();
   if (!session) redirect("/");

   const playersCollection = db.collection("players");
   const user = await playersCollection.findOne({ osuid: session.user.id });
   if (!user || !(user.approver || user.admin)) redirect("/");

   return <div>Approver page</div>;
}
