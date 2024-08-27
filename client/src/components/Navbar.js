import SignIn from "@/components/SignIn";
import Link from "next/link";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

export default function Navbar() {
   return (
      <div className="sticky-top w-100 border p-2 bg-body">
         <Container className="d-flex gap-2 align-items-center">
            <Link href="/">
               <Button>Home</Button>
            </Link>
            <Link href="/mappool">
               <Button>Select Pool</Button>
            </Link>
            <div className="mx-auto" />
            <SignIn />
         </Container>
      </div>
   );
}
