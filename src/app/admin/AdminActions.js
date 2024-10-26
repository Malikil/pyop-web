"use client";

import { Button, Card, CardBody, CardTitle } from "react-bootstrap";
import { advancePools } from "./functions";
import { toast } from "react-toastify";
import { useState } from "react";

export default function AdminActions() {
   const [confirmAdvance, setConfirmAdvance] = useState(false);
   return (
      <Card>
         <CardBody>
            <CardTitle>Actions</CardTitle>
            <Button
               variant={confirmAdvance ? "warning" : "primary"}
               onClick={() => {
                  if (confirmAdvance)
                     toast
                        .promise(advancePools, {
                           pending: "Advancing mappools",
                           error: "Failed to advance mappools",
                           success: "Pools advanced"
                        })
                        .then(() => setConfirmAdvance(false));
                  else setConfirmAdvance(true);
               }}
            >
               Advance Mappools
            </Button>
         </CardBody>
      </Card>
   );
}
