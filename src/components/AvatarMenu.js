import db from "@/app/api/db/connection";
import { auth, signOut } from "@/auth";
import Link from "next/link";
import { cache } from "react";

const checkAdmin = cache(async osuid => {
   const collection = db.collection("players");
   const player = await collection.findOne({ osuid });
   return player?.admin;
});

export default async function AvatarMenu() {
   const session = await auth();
   const admin = await checkAdmin(session.user.id);
   return (
      <ul className="dropdown-menu dropdown-menu-end">
         {admin && (
            <>
               <li>
                  <Link className="dropdown-item" href="/admin">
                     Admin
                  </Link>
               </li>
               <li>
                  <Link className="dropdown-item" href="/admin/approver">
                     Approving
                  </Link>
               </li>
               <li>
                  <hr className="dropdown-divider" />
               </li>
            </>
         )}
         <li>
            <form
               action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
               }}
            >
               <button className="dropdown-item" type="submit">
                  Logout
               </button>
            </form>
         </li>
      </ul>
   );
}
