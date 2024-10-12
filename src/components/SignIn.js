import { auth, signIn } from "@/auth";
import Button from "react-bootstrap/Button";
import UserAvatar from "./UserAvatar";

export default async function SignIn() {
   const session = await auth();
   if (!session?.user)
      return (
         <form
            action={async () => {
               "use server";
               await signIn("osu");
            }}
         >
            <Button type="submit">Log in with osu!</Button>
         </form>
      );
   return <UserAvatar src={session.user.image} />;
}
