"use client";

import { Container, Spinner } from "react-bootstrap";
import ModPool from "./modpool";
import AddMapButton from "./addmap";
import { ModsEnum } from "osu-web.js";
import usePlayer from "@/hooks/usePlayer";
import { useRouter } from "next/navigation";
import PoolStats from "./PoolStats";
import { useEffect, useState } from "react";

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
         <div className="d-flex flex-column gap-4">
            <ModPool mod="NoMod" maps={maps.nm} minCount={2} />
            <ModPool mod="Hidden" maps={maps.hd} minCount={2} />
            <ModPool mod="Hard Rock" maps={maps.hr} minCount={2} />
            <ModPool mod="Double Time" maps={maps.dt} minCount={2} />
            {maps.other.length > 0 && <ModPool mod="Other" maps={maps.other} showMods />}
         </div>
         <PoolStats maps={player.maps.current} />
         <AddMapButton count={player.maps.current.length} />
      </Container>
   );
}
