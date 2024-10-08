import { signIn } from "@/auth";
import Button from "react-bootstrap/Button";
import UserAvatar from "./UserAvatar";

export default async function SignIn() {
   return (
      <UserAvatar
         fallback={
            <form
               action={async () => {
                  "use server";
                  await signIn("osu");
               }}
            >
               <Button type="submit">Log in with osu!</Button>
            </form>
         }
      />
   );
}
