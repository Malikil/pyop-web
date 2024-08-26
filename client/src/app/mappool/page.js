"use client";

import { Button, Col, Container, Row } from "react-bootstrap";
import ModPool from "./modpool";
import { PlusCircle } from "react-bootstrap-icons";
import {
   autoUpdate,
   offset,
   useClick,
   useDismiss,
   useFloating,
   useInteractions
} from "@floating-ui/react";
import { useState } from "react";

export default function Mappool() {
   const maps = [
      {
         id: 1781960,
         setid: 852544,
         artist: "米津玄師",
         title: "LOSER",
         version: "WINNER",
         length: 240,
         bpm: 121,
         cs: 4.1,
         ar: 9.3,
         stars: 5.47
      },
      {
         id: 4613868,
         setid: 2183434,
         artist: "+kin_",
         title: "Astral Ascension",
         version: "Further",
         length: 144,
         bpm: 160,
         cs: 4,
         ar: 9.3,
         stars: 6.32
      },
      {
         id: 4696634,
         setid: 2216274,
         artist: "QWER",
         title: "ANIMA POWER",
         version: "Not Classic Extra",
         length: 83,
         bpm: 175,
         cs: 4,
         ar: 9.3,
         stars: 5.54
      },
      {
         id: 4606556,
         setid: 2180691,
         artist: "Questbound",
         title: "The Fires Ignite",
         version: "Ardent Conflagration",
         length: 375,
         bpm: 190,
         cs: 4.2,
         ar: 9.8,
         stars: 7.81
      },
      {
         id: 3583475,
         setid: 1746432,
         artist: "Daft Punk",
         title: "Crescendolls",
         version: "Discovery",
         length: 205,
         bpm: 124.08,
         cs: 4,
         ar: 9,
         stars: 5.32
      }
   ];
   const [isOpen, setIsOpen] = useState(true);
   const { refs, floatingStyles, context } = useFloating({
      placement: "left-end",
      strategy: "fixed",
      whileElementsMounted: autoUpdate,
      middleware: [offset(5)],
      open: isOpen,
      onOpenChange: setIsOpen
   });
   const click = useClick(context);
   const dismiss = useDismiss(context);
   const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);
   return (
      <Container className="py-2">
         <div className="d-flex flex-column gap-4">
            <ModPool mod="NoMod" maps={maps} />
            <ModPool mod="Hidden" maps={maps.slice(0, 3)} />
            <ModPool mod="Hard Rock" maps={maps.slice(1, 3)} />
         </div>
         <Button
            ref={refs.setReference}
            {...getReferenceProps()}
            className="position-fixed bottom-0 end-0 m-4 rounded-circle p-2"
         >
            <PlusCircle size={32} />
         </Button>
         {isOpen && (
            <div
               ref={refs.setFloating}
               style={floatingStyles}
               className="border rounded p-1 bg-body d-flex flex-column gap-1"
               {...getFloatingProps()}
            >
               <Row>
                  <Col>Beatmap Link:</Col>
                  <Col>
                     <input />
                  </Col>
               </Row>
               <Row>
                  <Col>Mod:</Col>
                  <Col>
                     <input />
                  </Col>
               </Row>
               <Button>Add</Button>
            </div>
         )}
      </Container>
   );
}
