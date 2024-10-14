import Image from "next/image";
import { signOut } from "@/auth";

export default function UserAvatar({ src }) {
   return (
      <div className="dropdown">
         <Image
            src={src}
            alt="User Avatar"
            width={64}
            height={64}
            className="rounded-circle"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
         />
         <div className="dropdown-menu dropdown-menu-end">
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
         </div>
      </div>
   );
}
