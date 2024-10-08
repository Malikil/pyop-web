import { auth } from "@/auth";

export default async function Home() {
   const session = await auth();

   return (
      <main>
         <h1>Home page content</h1>
         {session && <pre>{JSON.stringify(session, null, 2)}</pre>}
      </main>
   );
}
