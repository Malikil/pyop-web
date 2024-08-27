import { auth } from "@/auth";

export default async function UserAvatar({ fallback }) {
   const session = await auth();

   if (!session?.user) return fallback;

   return (
      <div>
         <img src={session.user.image} alt="User Avatar" width={64} className="rounded-circle" />
      </div>
   );
}
