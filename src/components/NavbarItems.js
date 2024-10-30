import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function NavbarItems() {
   return (
      <ul className="navbar-nav">
         <li className="nav-item dropdown">
            <a
               className="nav-link dropdown-toggle"
               href="#"
               role="button"
               data-bs-toggle="dropdown"
               aria-expanded="false"
            >
               Links
            </a>
            <ul className="dropdown-menu">
               <li>
                  <Link className="dropdown-item" href="#">
                     Pools/Schedule
                  </Link>
               </li>
               <li>
                  <Link className="dropdown-item" href="#">
                     Challonge
                  </Link>
               </li>
            </ul>
         </li>
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
