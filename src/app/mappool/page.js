"use client";

import { Container, Spinner } from "react-bootstrap";
import ModPool from "./modpool";
import AddMapButton from "./addmap";
import { ModsEnum } from "osu-web.js";
import usePlayer from "@/hooks/usePlayer";
import { useRouter } from "next/navigation";
import PoolStats from "./PoolStats";

export default function Mappool() {
   const { data: player, isLoading, isError } = usePlayer();
   const router = useRouter();
   if (isLoading) return <Spinner className="m-4" />;
   if (isError || !player) return router.push("/");

   console.log(player);
   const maps = player.maps.current;
   return (
      <Container className="py-2">
         <div className="d-flex flex-column gap-4">
            <ModPool mod="NoMod" maps={maps.filter(m => !m.mods)} minCount={2} />
            <ModPool mod="Hidden" maps={maps.filter(m => m.mods === ModsEnum.HD)} minCount={2} />
            <ModPool mod="Hard Rock" maps={maps.filter(m => m.mods === ModsEnum.HR)} minCount={2} />
            <ModPool
               mod="Double Time"
               maps={maps.filter(m => m.mods === ModsEnum.DT)}
               minCount={2}
            />
         </div>
         <PoolStats maps={maps} />
         <AddMapButton count={maps.length} />
      </Container>
   );
}
