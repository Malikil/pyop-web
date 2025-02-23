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
                  <Link
                     className="dropdown-item"
                     href={process.env.MAIN_SPREADSHEET_LINK || '#'}
                     target="_blank"
                     rel="noopener noreferrer"
                  >
                     Pools/Schedule
                  </Link>
               </li>
               <li>
                  <Link
                     className="dropdown-item"
                     href="https://challonge.com/pyop_refresh"
                     target="_blank"
                     rel="noopener noreferrer"
                  >
                     Challonge
                  </Link>
               </li>
               <li>
                  <Link
                     className="dropdown-item"
                     href="https://discord.gg/dD4WQme"
                     target="_blank"
                     rel="noopener noreferrer"
                  >
                     Discord
                  </Link>
               </li>
               <li>
                  <Link
                     className="dropdown-item"
                     href="https://osu.ppy.sh/community/forums/topics/2039534"
                     target="_blank"
                     rel="noopener noreferrer"
                  >
                     Forum Post
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
