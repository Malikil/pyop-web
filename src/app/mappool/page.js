"use client";

import { Container, Spinner } from "react-bootstrap";
import AddMapButton from "./addmap";
import { ModsEnum } from "osu-web.js";
import usePlayer from "@/hooks/usePlayer";
import { useRouter } from "next/navigation";
import PoolStats from "@/components/mappool/PoolStats";
import { useEffect, useState } from "react";
import MapList from "@/components/mappool/MapList";

export default function Mappool() {
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
         <MapList maps={maps} />
         <PoolStats maps={player.maps.current} />
         <AddMapButton count={player.maps.current.length} />
      </Container>
   );
}
