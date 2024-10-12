import { auth } from "@/auth";
import Image from "next/image";

export default async function UserAvatar({ fallback }) {
   const session = await auth();

   if (!session?.user) return fallback;

   return (
      <div>
         <Image
            src={session.user.image}
            alt="User Avatar"
            width={64}
            height={64}
            className="rounded-circle"
         />
      </div>
   );
}
