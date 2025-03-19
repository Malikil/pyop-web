"use client";

import { Button, ButtonGroup, Col, Row, Spinner, ToggleButton } from "react-bootstrap";
import { CheckCircle, DashCircle, ExclamationCircle, PlusCircle } from "react-bootstrap-icons";
import {
   autoUpdate,
   offset,
   useClick,
   useDismiss,
   useFloating,
   useInteractions
} from "@floating-ui/react";
import { useEffect, useState } from "react";
import { ModsEnum } from "osu-web.js";
import { checkTokenValid } from "./actions";

/**
 * @callback AddFunc 
 * @param {number} mapid 
 * @param {number} mods 
 * @returns {Promise<void>}
 */
/**
 * @param {object} params 
 * @param {number} params.count 
 * @param {number} params.max 
 * @param {AddFunc} params.addFunc 
 * @param {boolean} [params.disabled]
 */
export default function AddMapButton({ count, addFunc, max, disabled }) {
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
   useEffect(() => {
      if (count >= max) setIsOpen(false);
   }, [count, max]);
   const [mapAdding, setMapAdding] = useState(false);

   // Make sure the osu token is still valid
   const [validToken, setValidToken] = useState(true);
   useEffect(() => {
      checkTokenValid().then(setValidToken);
   }, []);
   useEffect(() => console.log("Valid token", validToken), [validToken]);

   return (
      <div className="position-fixed bottom-0 end-0 m-3 rounded-circle p-2">
         {count !== -1 && (
            <div className="text-center">
               {count || 0} / {max}
            </div>
         )}
         <Button
            aria-label="Add Map"
            ref={refs.setReference}
            {...getReferenceProps()}
            disabled={disabled === "never" ? false : disabled || count >= max}
            variant={
               disabled === "never"
                  ? "primary"
                  : disabled
                  ? "danger"
                  : count < max
                  ? "primary"
                  : "success"
            }
         >
            {disabled !== "never" && disabled ? (
               <DashCircle size={32} />
            ) : disabled === "never" || count < max ? (
               <PlusCircle size={32} />
            ) : (
               <CheckCircle size={32} />
            )}
         </Button>
         {isOpen && (
            <div
               ref={refs.setFloating}
               style={floatingStyles}
               className="border rounded p-1 bg-body d-flex flex-column gap-1"
               {...getFloatingProps()}
            >
               {!validToken ? (
                  <div className="d-flex flex-column align-items-center">
                     <ExclamationCircle className="text-warning m-1" />
                     <div>osu! access token expired</div>
                     <div>Please log in again</div>
                  </div>
               ) : (
                  <>
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
                                       oldMods =>
                                          (oldMods | ModsEnum.EZ) ^ (ModsEnum.HR | ModsEnum.EZ)
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
                                       oldMods =>
                                          (oldMods | ModsEnum.HT) ^ (ModsEnum.DT | ModsEnum.HT)
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
                                       oldMods =>
                                          (oldMods | ModsEnum.HR) ^ (ModsEnum.EZ | ModsEnum.HR)
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
                                       oldMods =>
                                          (oldMods | ModsEnum.DT) ^ (ModsEnum.HT | ModsEnum.DT)
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
                           // Update the list locally
                           console.log({ mapLink, mods });
                           const mapid = parseInt(mapLink.slice(mapLink.lastIndexOf("/") + 1));
                           if (isNaN(mapid)) return;
                           setMapAdding(true);
                           if (await addFunc(mapid, mods)) {
                              setMapLink("");
                              setMods(0);
                           }
                           setMapAdding(false);
                        }}
                     >
                        Add {mapAdding && <Spinner size="sm" />}
                     </Button>
                  </>
               )}
            </div>
         )}
      </div>
   );
}
