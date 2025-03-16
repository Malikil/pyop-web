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
import { useContext } from "react";
import MatchContext from "../MatchContext";

export default function MatchSetup() {
   const { context, setContext } = useContext(MatchContext);

   const nextPick = () => {
      if (!context.player1.roll || !context.player2.roll) return "";
      if (context.player1.score * 2 > context.bestOf || context.player2.score * 2 > context.bestOf)
         return "";
      const firstPick = +(context.player1.roll < context.player2.roll);
      const picked = context.maps.filter(m => m.map).length;
      const nextVar = (firstPick + picked) % 2;
      return ` | Next pick: ${context[`player${nextVar + 1}`].name}`;
   };

   return (
      <Card>
         <CardHeader>Match Setup</CardHeader>
         <CardBody className="d-flex flex-column gap-1">
            <Row>
               <Col>
                  <FormGroup>
                     <FormLabel>Match ID</FormLabel>
                     <FormControl
                        type="text"
                        value={context.matchId}
                        onChange={e => setContext(v => ({ ...v, matchId: e.target.value }))}
                        placeholder="10"
                     />
                  </FormGroup>
               </Col>
            </Row>
            <Row>
               <Col>
                  <FormGroup>
                     <FormLabel>Create Match</FormLabel>
                     <FormControl
                        type="button"
                        value={`!mp make PYOP: (${context.player1.name}) vs (${context.player2.name})`}
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
                     <FormControl
                        type="text"
                        value={context.mp}
                        onChange={e => setContext(v => ({ ...v, mp: e.target.value }))}
                        placeholder="https://osu.ppy.sh/mp/12345"
                     />
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
                        value={context.player1.roll}
                        onChange={e =>
                           setContext(v => ({
                              ...v,
                              player1: {
                                 ...v.player1,
                                 roll: parseInt(e.target.value) || ""
                              }
                           }))
                        }
                     />
                  </FormGroup>
               </Col>
               <Col>
                  <FormGroup>
                     <FormLabel>{context.player2.name} roll</FormLabel>
                     <FormControl
                        type="text"
                        placeholder="0"
                        value={context.player2.roll}
                        onChange={e =>
                           setContext(v => ({
                              ...v,
                              player2: {
                                 ...v.player2,
                                 roll: parseInt(e.target.value) || ""
                              }
                           }))
                        }
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
                        value={`${context.player1.name} ${context.player1.score} - ${
                           context.player2.score
                        } ${context.player2.name}${nextPick()}`}
                        onClick={copyTextE}
                     />
                  </FormGroup>
               </Col>
            </Row>
         </CardBody>
      </Card>
   );
}
