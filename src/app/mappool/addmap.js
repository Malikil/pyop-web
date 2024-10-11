"use client";

import { Button, ButtonGroup, Col, Row, ToggleButton } from "react-bootstrap";
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
import { ModsEnum } from "osu-web.js";
import { useSWRConfig } from "swr";

export default function AddMapButton({ count }) {
   const { mutate } = useSWRConfig();
   // Handle add button popup box
   const [isOpen, setIsOpen] = useState(false);
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

   // Handle form data
   const [mapLink, setMapLink] = useState("");
   const [mods, setMods] = useState(0);

   return (
      <div className="position-fixed bottom-0 end-0 m-4 rounded-circle p-2">
         <div className="text-center">{count || 0} / 10</div>
         <Button ref={refs.setReference} {...getReferenceProps()}>
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
                     <input value={mapLink} onChange={e => setMapLink(e.target.value)} />
                  </Col>
               </Row>
               <Row>
                  <Col>Mod:</Col>
                  <Col>
                     <ButtonGroup>
                        <ToggleButton
                           id="hd-toggle"
                           type="checkbox"
                           variant="outline-primary"
                           checked={!!(mods & ModsEnum.HD)}
                           value={ModsEnum.HD}
                           onClick={() => setMods(oldMods => oldMods ^ ModsEnum.HD)}
                        >
                           HD
                        </ToggleButton>
                        <ToggleButton
                           id="hr-toggle"
                           type="checkbox"
                           variant="outline-primary"
                           checked={!!(mods & ModsEnum.HR)}
                           onClick={() =>
                              setMods(
                                 oldMods => (oldMods | ModsEnum.EZ) ^ (ModsEnum.HR | ModsEnum.EZ)
                              )
                           }
                        >
                           HR
                        </ToggleButton>
                        <ToggleButton
                           id="dt-toggle"
                           type="checkbox"
                           variant="outline-primary"
                           checked={!!(mods & ModsEnum.DT)}
                           onClick={() =>
                              setMods(
                                 oldMods => (oldMods | ModsEnum.HT) ^ (ModsEnum.DT | ModsEnum.HT)
                              )
                           }
                        >
                           DT
                        </ToggleButton>
                        <ToggleButton
                           id="ez-toggle"
                           type="checkbox"
                           variant="outline-primary"
                           checked={!!(mods & ModsEnum.EZ)}
                           onClick={() =>
                              setMods(
                                 oldMods => (oldMods | ModsEnum.HR) ^ (ModsEnum.EZ | ModsEnum.HR)
                              )
                           }
                        >
                           EZ
                        </ToggleButton>
                        <ToggleButton
                           id="ht-toggle"
                           type="checkbox"
                           variant="outline-primary"
                           checked={!!(mods & ModsEnum.HT)}
                           onClick={() =>
                              setMods(
                                 oldMods => (oldMods | ModsEnum.DT) ^ (ModsEnum.HT | ModsEnum.DT)
                              )
                           }
                        >
                           HT
                        </ToggleButton>
                     </ButtonGroup>
                  </Col>
               </Row>
               <Button
                  onClick={async () => {
                     const debugMapData = {
                        id: 1781960,
                        setid: 852544,
                        artist: "米津玄師",
                        title: "LOSER",
                        version: "WINNER",
                        length: 240,
                        bpm: 121,
                        cs: 4.1,
                        ar: 9.3,
                        stars: 5.47,
                        mods: 8
                     };
                     // Get map data
                     // Send the data to the server
                     // (Maybe the server will fetch and just respond with the map data idk)

                     // Update the list locally
                     console.log({ mapLink, mods });
                     mutate(
                        "/api/db/player",
                        () =>
                           fetch("/api/db/maps", {
                              method: "POST",
                              body: JSON.stringify(debugMapData)
                           }),
                        {
                           populateCache: (result, player) => ({
                              ...player,
                              maps: {
                                 ...player.maps,
                                 current: player.maps.current.concat(debugMapData)
                              }
                           }),
                           revalidate: false
                        }
                     );
                  }}
               >
                  Add
               </Button>
            </div>
         )}
      </div>
   );
}
