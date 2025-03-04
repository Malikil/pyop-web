"use client";

import { Container, Spinner } from "react-bootstrap";
import PoolStats from "@/components/mappool/PoolStats";
import MapList from "@/components/mappool/MapList";
import AddMapButton from "@/app/mappool/AddMapButton";
import { addAutofillMap, fetchAutofillMaps } from "./actions";
import useSWR from "swr";
import { useRouter } from "next/navigation";

export default function Fillerpool() {
   const { data, error, isLoading, mutate } = useSWR("autofill", fetchAutofillMaps);
   const router = useRouter();

   if (isLoading) return <Spinner className="m-4" />;
   if (error) return router.push("/");
   return (
      <Container>
         {/* <MapList
            maps={maps}
            mapActions={[
               {
                  title: "Remove",
                  action: beatmap => {}
               }
            ]}
         /> */}
         <PoolStats />
         <AddMapButton
            count={data.count}
            max={data.max}
            addFunc={async (mapid, mods) => {
               const result = addAutofillMap(mapid, mods);
            }}
         />
      </Container>
   );
}
