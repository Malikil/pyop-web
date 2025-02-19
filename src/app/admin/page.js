import { auth, checkExpiry } from "@/auth";
import db from "../api/db/connection";
import { redirect } from "next/navigation";
import RegisterCard from "./components/registration/RegisterCard";
import SubmissionsCard from "./components/submissions/SubmissionsCard";
import AdminActions from "./components/actions/AdminActions";
import UserList from "./components/userlist/UserList";
import AdminNotify from "./admin-notify/AdminNotify";

export default async function Admin() {
   const session = await auth();
   if (!session) redirect("/");

   const playersCollection = db.collection("players");
   const user = await playersCollection.findOne({ osuid: session.user.id });
   if (!user?.admin) redirect("/");

   return (
      <div>
         <div className="d-flex gap-3 flex-wrap my-3">
            <SubmissionsCard />
            <RegisterCard />
            <AdminActions />
         </div>
         <UserList />
         {checkExpiry(session.accessToken) && <AdminNotify />}
      </div>
   );
}
