"use client";

import { useEffect, useState } from "react";
import { MoonStars, Sun } from "react-bootstrap-icons";

export default function ThemeToggle() {
   const [curTheme, setCurTheme] = useState();
   useEffect(() => setCurTheme(document.documentElement.getAttribute("data-bs-theme")), []);

   return (
      <div
         className="rounded-circle px-2 d-flex"
         role="button"
         aria-label="Change Theme"
         onClick={() =>
            setCurTheme(prev => {
               if (prev === "dark") {
                  document.documentElement.setAttribute("data-bs-theme", "light");
                  return "light";
               } else {
                  document.documentElement.setAttribute("data-bs-theme", "dark");
                  return "dark";
               }
            })
         }
      >
         {curTheme === "dark" ? <MoonStars /> : <Sun />}
      </div>
   );
}
