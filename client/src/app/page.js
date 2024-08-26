import Link from "next/link";
import Button from "react-bootstrap/Button";

export default function Home() {
   return (
      <main>
         <Link href="/mappool">
            <Button>Select Pool</Button>
         </Link>
      </main>
   );
}
