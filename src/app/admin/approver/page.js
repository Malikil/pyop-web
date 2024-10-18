"use client";

import MapList from "@/components/mappool/MapList";
import { useRouter } from "next/navigation";
import { getApprovalMaplist, updateApproval } from "./actions";
import useSWR from "swr";
import { ModsEnum } from "osu-web.js";
import { Spinner } from "react-bootstrap";

export default function ApproverPage() {
   const { data, error, isLoading, mutate } = useSWR("approvalMaps", getApprovalMaplist);
   const router = useRouter();

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
                  mutate(() => updateApproval(beatmap, "rejected"), {
                     populateCache: popCache(beatmap, "rejected")
                  });
               }
            }
         ]}
      />
   );
}
