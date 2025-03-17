"use client";

import { Button, Card, CardBody, CardTitle, Col, Row } from "react-bootstrap";
import {
   advancePools,
   autofillMaps,
   clearScreenshots,
   exportPools,
   fetchUsernames,
   pruneAutofill
} from "./actions";
import { toast } from "react-toastify";
import ConfirmButton from "@/components/ConfirmButton";

export default function AdminActions() {
   return (
      <Card>
         <CardBody>
            <CardTitle>Actions</CardTitle>
            <Row>
               <Col className="d-flex flex-column gap-3">
                  <Button
                     onClick={() =>
                        toast.promise(clearScreenshots, {
                           pending: "Clearing old screenshots",
                           error: "Failed to clear screenshots",
                           success: "Screenshots cleared"
                        })
                     }
                  >
                     Clean Screenshots
                  </Button>
                  <Button
                     onClick={() =>
                        toast.promise(exportPools, {
                           pending: "Exporting mappools",
                           error: "Failed to export mappools",
                           success: "Export completed"
                        })
                     }
                  >
                     Export Mappools
                  </Button>
                  <ConfirmButton
                     onClick={() =>
                        toast.promise(advancePools, {
                           pending: "Advancing mappools",
                           error: "Failed to advance mappools",
                           success: "Pools advanced"
                        })
                     }
                  >
                     Advance Mappools
                  </ConfirmButton>
               </Col>
               <Col className="d-flex flex-column gap-3">
                  <ConfirmButton
                     onClick={() =>
                        toast.promise(fetchUsernames, {
                           pending: "Fetching usernames",
                           error: "Failed to fetch usernames",
                           success: "Fetched usernames"
                        })
                     }
                  >
                     Fetch Usernames
                  </ConfirmButton>
                  <ConfirmButton
                     onClick={() =>
                        toast.promise(pruneAutofill, {
                           pending: "Pruning autofill",
                           error: "Failed to update list",
                           success: {
                              render: ({ data }) => `Removed ${data.deletedCount} maps`
                           }
                        })
                     }
                  >
                     Prune Autofill
                  </ConfirmButton>
                  <ConfirmButton
                     onClick={() =>
                        toast.promise(autofillMaps, {
                           pending: "Filling maps",
                           error: "Failed to autofill maps",
                           success: {
                              render: ({ data }) => {
                                 return `Autofilled maps. Warnings: ${data.join("\n")}`;
                              }
                           }
                        })
                     }
                  >
                     Autofill Maps
                  </ConfirmButton>
               </Col>
            </Row>
         </CardBody>
      </Card>
   );
}
