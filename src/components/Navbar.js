import SignIn from "@/components/SignIn";
import Link from "next/link";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

export default function Navbar() {
   return (
      <div className="sticky-top w-100 border-bottom bg-body">
         <nav className="navbar navbar-expand-sm">
            <Container className="d-flex gap-2 align-items-center position-relative">
               <Link className="navbar-brand" href="/">
                  <Button>Home</Button>
               </Link>
               <button
                  className="navbar-toggler ms-auto"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarSupportedContent"
                  aria-controls="navbarSupportedContent"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
               >
                  <span className="navbar-toggler-icon" />
               </button>
               <div className="collapse navbar-collapse" id="navbarSupportedContent">
                  <ul className="navbar-nav">
                     <li className="nav-item">
                        <Link className="nav-link" href="/register">
                           Registration
                        </Link>
                     </li>
                     <li className="nav-item">
                        <Link className="nav-link" href="/mappool">
                           Select Pool
                        </Link>
                     </li>
                  </ul>
               </div>
               <div className="mx-lg-auto" />
               <div className="user-icon-responsive">
                  <SignIn />
               </div>
            </Container>
         </nav>
      </div>
   );
}
