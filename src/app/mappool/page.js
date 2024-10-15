"use client";

import { Container, Spinner } from "react-bootstrap";
import AddMapButton from "./addmap";
import { ModsEnum } from "osu-web.js";
import usePlayer from "@/hooks/usePlayer";
import { useRouter } from "next/navigation";
import PoolStats from "@/components/mappool/PoolStats";
import { useEffect, useState } from "react";
import MapList from "@/components/mappool/MapList";
import { useSWRConfig } from "swr";

export default function Mappool() {
   const { mutate } = useSWRConfig();
   const { data: player, isLoading, isError } = usePlayer();
   const router = useRouter();

   const [maps, setMaps] = useState({
      nm: [],
      hd: [],
      hr: [],
      dt: [],
      other: []
   });
   useEffect(() => {
      if (isError || isLoading) return;
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
            {
               nm: [],
               hd: [],
               hr: [],
               dt: [],
               other: []
            }
         )
      );
   }, [player, isLoading, isError]);

   if (isLoading) return <Spinner className="m-4" />;
   if (isError || !player) return router.push("/");
   return (
      <Container className="py-2">
         <MapList
            maps={maps}
            mapActions={[
               {
                  title: "Remove",
                  action: beatmap =>
                     mutate(
                        "/api/db/player",
                        () =>
                           fetch(`/api/db/maps?id=${beatmap.id}&mods=${beatmap.mods}`, {
                              method: "DELETE"
                           }).then(res => res.json()),
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
                           }),
                           revalidate: true
                        }
                     )
               }
            ]}
         />
         <PoolStats maps={player.maps.current} />
         <AddMapButton count={player.maps.current.length} />
      </Container>
   );
}
