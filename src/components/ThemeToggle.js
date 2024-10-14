"use client";

import { useState } from "react";
import { MoonStars, Sun } from "react-bootstrap-icons";

export default function ThemeToggle() {
   const [curTheme, setCurTheme] = useState(document.documentElement.getAttribute("data-bs-theme"));

   return (
      <div
         className="position-fixed bottom-0 end-0 m-3 rounded-circle p-2"
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
