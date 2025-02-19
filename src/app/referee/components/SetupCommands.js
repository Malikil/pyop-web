"use client";

import {
   Card,
   CardBody,
   CardHeader,
   Row,
   Col,
   FormControl,
   FormGroup,
   FormLabel,
   Button
} from "react-bootstrap";
import { copyTextE } from "./copytext";

export default function SetupCommands({ p1, p2, next }) {
   return (
      <Card>
         <CardHeader>Setup Commands</CardHeader>
         <CardBody className="d-flex flex-column gap-1">
            <Row>
               <Col>
                  <FormGroup>
                     <FormLabel>Create Match</FormLabel>
                     <FormControl
                        type="button"
                        value={`!mp make PYOP: ${p1.name} vs ${p2.name}`}
                        onClick={copyTextE}
                     />
                  </FormGroup>
               </Col>
            </Row>
            <Row>
               <Col>
                  <FormGroup>
                     <FormLabel>{p1.name} roll</FormLabel>
                     <FormControl type="input" placeholder="0" />
                  </FormGroup>
               </Col>
               <Col>
                  <FormGroup>
                     <FormLabel>{p2.name} roll</FormLabel>
                     <FormControl type="input" placeholder="0" />
                  </FormGroup>
               </Col>
            </Row>
            <Row>
               <Col>
                  <FormGroup>
                     <FormLabel>After map</FormLabel>
                     <FormControl
                        type="button"
                        value={`${p1.name} ${p1.score} - ${p2.score} ${p2.name} | Next pick: ${next}`}
                        onClick={copyTextE}
                     />
                  </FormGroup>
               </Col>
            </Row>
         </CardBody>
      </Card>
   );
}
