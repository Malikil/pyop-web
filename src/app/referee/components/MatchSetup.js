"use client";

import {
   Card,
   CardBody,
   CardHeader,
   Row,
   Col,
   FormControl,
   FormGroup,
   FormLabel
} from "react-bootstrap";
import { copyTextE } from "./copytext";
import { useContext, useEffect, useState } from "react";
import MatchContext from "../matchContext";

export default function MatchSetup() {
   const { context, setContext } = useContext(MatchContext);
   const [p1Roll, setP1Roll] = useState("");
   const [p2Roll, setP2Roll] = useState("");
   useEffect(() => {
      if (p1Roll && p2Roll)
         setContext(v => ({
            ...v,
            firstPick: +(parseInt(p1Roll) > parseInt(p2Roll)) + 1
         }));
   }, [p1Roll, p2Roll]);

   return (
      <Card>
         <CardHeader>Match Setup</CardHeader>
         <CardBody className="d-flex flex-column gap-1">
            <Row>
               <Col>
                  <FormGroup>
                     <FormLabel>Create Match</FormLabel>
                     <FormControl
                        type="button"
                        value={`!mp make PYOP: ${context.player1.name} vs ${context.player2.name}`}
                        onClick={copyTextE}
                     />
                     <FormControl
                        className="mt-1"
                        type="button"
                        value="!mp set 0 3 3"
                        onClick={copyTextE}
                     />
                  </FormGroup>
                  <Row>
                     <Col>
                        <FormControl
                           className="mt-1"
                           type="button"
                           value={`!mp invite ${context.player1.name}`}
                           onClick={copyTextE}
                        />
                     </Col>
                     <Col>
                        <FormControl
                           className="mt-1"
                           type="button"
                           value={`!mp invite ${context.player2.name}`}
                           onClick={copyTextE}
                        />
                     </Col>
                  </Row>
               </Col>
            </Row>
            <Row>
               <Col>
                  <FormGroup>
                     <FormLabel>MP link</FormLabel>
                     <FormControl type="text" placeholder="https://osu.ppy.sh/mp/12345" />
                  </FormGroup>
               </Col>
            </Row>
            <Row>
               <Col>
                  <FormGroup>
                     <FormLabel>{context.player1.name} roll</FormLabel>
                     <FormControl
                        type="text"
                        placeholder="0"
                        value={p1Roll}
                        onChange={e => setP1Roll(e.target.value)}
                     />
                  </FormGroup>
               </Col>
               <Col>
                  <FormGroup>
                     <FormLabel>{context.player2.name} roll</FormLabel>
                     <FormControl
                        type="text"
                        placeholder="0"
                        value={p2Roll}
                        onChange={e => setP2Roll(e.target.value)}
                     />
                  </FormGroup>
               </Col>
            </Row>
            <Row>
               <Col>
                  <FormGroup>
                     <FormLabel>After map</FormLabel>
                     <FormControl
                        type="button"
                        value={`${context.player1.name} ${context.player1.score} - ${context.player2.score} ${context.player2.name} | Next pick: ${context.nextPick}`}
                        onClick={copyTextE}
                     />
                  </FormGroup>
               </Col>
            </Row>
         </CardBody>
      </Card>
   );
}
