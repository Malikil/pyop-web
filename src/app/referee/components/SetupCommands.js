"use client";

import { Card, CardBody, CardHeader, Row, Col, FormControl } from "react-bootstrap";
import { copyTextE } from "./copytext";

export default function SetupCommands() {
   return (
      <Card>
         <CardHeader>Setup Commands</CardHeader>
         <CardBody>
            <Row className="align-items-center">
               <Col>Create match</Col>
               <Col>
                  <FormControl
                     type="text"
                     value="!mp make "
                     readOnly
                     role="button"
                     onClick={copyTextE}
                  />
               </Col>
            </Row>
         </CardBody>
      </Card>
   );
}
