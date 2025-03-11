"use client";

import { Container, Spinner } from "react-bootstrap";
import { ModsEnum } from "osu-web.js";
import { useRouter } from "next/navigation";
import PoolStats from "@/components/mappool/PoolStats";
import MapList from "@/components/mappool/MapList";
import { useApproverAuth } from "@/hooks/useApproverAuth";
import { useEffect, useState } from "react";
import usePlayer from "@/hooks/usePlayer";

export default function PlayerMappool({ params }) {
   const { data: approver, error: authError, isLoading: authLoading } = useApproverAuth();
   const { data: player, error, isLoading, mutate } = usePlayer(params.playerid);
   const router = useRouter();

   const [maps, setMaps] = useState({ nm: [], hd: [], hr: [], dt: [], other: [] });
   useEffect(() => {
      if (!player || isLoading || error) return;
      setMaps(
         player.maps.current.reduce(
            (sorted, map) => {
               switch (map.mods) {
                  case 0:
                     sorted.nm.push(map);
                     break;
                  case ModsEnum.HD:
                     sorted.hd.push(map);
                     break;
                  case ModsEnum.HR:
                     sorted.hr.push(map);
                     break;
                  case ModsEnum.DT:
                     sorted.dt.push(map);
                     break;
                  default:
                     sorted.other.push(map);
               }
               return sorted;
            },
            { nm: [], hd: [], hr: [], dt: [], other: [] }
         )
      );
   }, [player, isLoading, error]);

   if (isLoading || authLoading) return <Spinner className="m-4" />;
   if (error || authError || !approver) return router.push("/");
   if (!player) return router.push("/admin/approver");
   return (
      <Container className="py-2">
         <h1>Pool for {player.osuname}</h1>
         <MapList
            maps={maps}
            mapActions={[
               {
                  title: "Remove",
                  action: beatmap =>
                     mutate(
                        () =>
                           fetch(
                              `/api/db/maps?id=${beatmap.id}&mods=${beatmap.mods}&player=${player.osuid}`,
                              {
                                 method: "DELETE"
                              }
                           ).then(res => res.json()),
                        {
                           optimisticData: player => {
                              const index = player.maps.current.findIndex(
                                 m => m.id === beatmap.id && m.mods === beatmap.mods
                              );
                              return {
                                 ...player,
                                 maps: {
                                    ...player.maps,
                                    current: player.maps.current.filter((_, i) => i !== index)
                                 }
                              };
                           },
                           populateCache: (result, player) => ({
                              ...player,
                              maps: {
                                 ...player.maps,
                                 current: result
                              }
                           })
                           //revalidate: true
                        }
                     ),
                  condition: beatmap => beatmap.approval === "rejected"
               }
            ]}
         />
         <PoolStats maps={player.maps.current} />
      </Container>
   );
}
