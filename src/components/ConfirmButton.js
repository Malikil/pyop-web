"use client";

import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

/**
 * @param {import("react-bootstrap").ButtonProps} props
 */
export default function ConfirmButton({ delay, onClick, variant, altVariant, children, ...props }) {
   const [confirmClick, setConfirmClick] = useState(false);
   useEffect(() => {
      const resetId = setTimeout(() => setConfirmClick(false), delay || 2000);
      return () => clearTimeout(resetId);
   }, [confirmClick, delay]);

   return (
      <Button
         onClick={e => {
            if (confirmClick) {
               onClick(e);
               setConfirmClick(false);
            } else setConfirmClick(true);
         }}
         variant={confirmClick ? altVariant || "warning" : variant || "primary"}
         {...props}
      >
         {children}
      </Button>
   );
}
