"use client";

import MapList from "@/components/mappool/MapList";
import { useRouter } from "next/navigation";
import { getApprovalMaplist, updateApproval } from "./actions";
import useSWR from "swr";
import { ModsEnum } from "osu-web.js";
import { Button, FormControl, FormLabel, Modal, Spinner } from "react-bootstrap";
import { useState } from "react";

export default function ApproverPage() {
   const { data, error, isLoading, mutate } = useSWR("approvalMaps", getApprovalMaplist);
   const router = useRouter();

   const [rejectMessage, setRejectMessage] = useState("");
   const [screenshot, setScreenshot] = useState(null);
   const [selectedMap, setSelectedMap] = useState(null);
   const [showModal, setShowModal] = useState(false);
   const [showRejectModal, setShowRejectModal] = useState(false);
   const [submitting, setSubmitting] = useState(false);

   if (isLoading) return <Spinner className="m-4" />;
   if (error) return router.push("/");

   const popCache = (beatmap, status) => (result, oldData) => {
      if (!result) return oldData;
      // It's 11:53pm and I don't feel like thinking any harder about this
      // Optimization Jank O.o
      if (beatmap.mods === 0)
         return {
            ...oldData,
            nm: oldData.nm.map(m => (m.id === beatmap.id ? { ...m, approval: status } : m))
         };
      else if (beatmap.mods === ModsEnum.HD)
         return {
            ...oldData,
            hd: oldData.hd.map(m => (m.id === beatmap.id ? { ...m, approval: status } : m))
         };
      else if (beatmap.mods === ModsEnum.HR)
         return {
            ...oldData,
            hr: oldData.hr.map(m => (m.id === beatmap.id ? { ...m, approval: status } : m))
         };
      else if (beatmap.mods === ModsEnum.DT)
         return {
            ...oldData,
            dt: oldData.dt.map(m => (m.id === beatmap.id ? { ...m, approval: status } : m))
         };
      else
         return {
            ...oldData,
            other: oldData.other.map(m =>
               m.id === beatmap.id && m.mods === beatmap.mods ? { ...m, approval: status } : m
            )
         };
   };

   return (
      <>
         <MapList
            maps={data}
            mapActions={[
               {
                  title: "Approve",
                  action: async beatmap => {
                     mutate(() => updateApproval(beatmap, "approved"), {
                        populateCache: popCache(beatmap, "approved")
                     });
                  }
               },
               {
                  title: "Reject",
                  action: async beatmap => {
                     setSelectedMap(beatmap);
                     setRejectMessage("");
                     setShowRejectModal(true);
                  }
               },
               {
                  title: "Screenshot",
                  action: async beatmap => {
                     if (beatmap.screenshot) {
                        console.log(beatmap.screenshot);
                        const buf = Buffer.from(beatmap.screenshot.data);
                        const blob = new Blob([buf], { type: "image/jpeg" });
                        console.log(blob);
                        const blobUrl = URL.createObjectURL(blob);
                        setScreenshot(blobUrl);
                     } else setScreenshot(null);

                     setShowModal(true);
                  },
                  condition: beatmap => !!beatmap.screenshot
               }
            ]}
         />
         <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
               <Modal.Title>Screenshot</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               {screenshot && (
                  <img
                     src={screenshot}
                     alt="Submitted Screenshot"
                     width="100%"
                     style={{ objectFit: "contain" }}
                  />
               )}
            </Modal.Body>
            <Modal.Footer>
               <Button onClick={() => setShowModal(false)}>Close</Button>
            </Modal.Footer>
         </Modal>
         <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
            <Modal.Header closeButton>
               <Modal.Title>Rejection</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <form
                  id="rejectForm"
                  action={async () => {
                     setSubmitting(true);
                     await mutate(() => updateApproval(selectedMap, "rejected", rejectMessage), {
                        populateCache: popCache(selectedMap, "rejected")
                     });
                     setSubmitting(false);
                     setShowRejectModal(false);
                  }}
               >
                  <FormLabel htmlFor="rejectMessage">Reject Message</FormLabel>
                  <FormControl
                     type="text"
                     id="rejectMessage"
                     value={rejectMessage}
                     onChange={e => setRejectMessage(e.target.value)}
                  />
               </form>
            </Modal.Body>
            <Modal.Footer>
               <Button type="submit" form="rejectForm" disabled={submitting}>
                  Submit {submitting && <Spinner size="sm" />}
               </Button>
               <Button onClick={() => setShowRejectModal(false)}>Close</Button>
            </Modal.Footer>
         </Modal>
      </>
   );
}
