"use client";

import { Container, Spinner } from "react-bootstrap";
import PoolStats from "@/components/mappool/PoolStats";
import MapList from "@/components/mappool/MapList";
import AddMapButton from "@/app/mappool/AddMapButton";
import { addAutofillMap, fetchAutofillMaps, removeAutofillMap } from "./actions";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { ModsEnum } from "osu-web.js";

export default function Fillerpool() {
   const { data, error, isLoading, mutate } = useSWR("autofill", fetchAutofillMaps);
   const router = useRouter();

   if (isLoading) return <Spinner className="m-4" />;
   if (error) return router.push("/");
   return (
      <Container>
         <MapList
            maps={data}
            counts={data.required}
            mapActions={[
               {
                  title: "Remove",
                  action: beatmap => {
                     mutate(() => removeAutofillMap(beatmap.id, beatmap.mods), {
                        optimisticData: current => {},
                        populateCache: (result, current) => {}
                     });
                  }
               }
            ]}
         />
         <PoolStats />
         <AddMapButton
            count={
               data.nm.length + data.hd.length + data.hr.length + data.dt.length + data.other.length
            }
            max={data.required.total}
            addFunc={(mapid, mods) =>
               mutate(() => addAutofillMap(mapid, mods), {
                  populateCache: (result, current) => {
                     if (!result) return current;
                     const pool = (m => {
                        switch (m) {
                           case 0:
                              return "nm";
                           case ModsEnum.HD:
                              return "hd";
                           case ModsEnum.HR:
                              return "hr";
                           case ModsEnum.DT:
                              return "dt";
                           default:
                              return "other";
                        }
                     })(result.mods);
                     return {
                        ...current,
                        [pool]: current[pool].concat([result]),
                        required: {
                           ...current.required,
                           [pool]: current.required[pool] - 1,
                           total: current.required.total - 1
                        }
                     };
                  }
                  // revalidate: false
               })
            }
         />
      </Container>
   );
}
