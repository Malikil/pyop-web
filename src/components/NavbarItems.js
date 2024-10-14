import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function NavbarItems() {
   return (
      <ul className="navbar-nav">
         <li className="nav-item">
            <Link className="nav-link" href="/mappool">
               Select Pool
            </Link>
         </li>
         <li className="nav-item d-flex align-items-center">
            <div className="nav-link">
               <ThemeToggle />
            </div>
         </li>
      </ul>
   );
}
