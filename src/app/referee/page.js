"use client";

import MatchInfo from "./components/MatchInfo";
import MatchSetup from "./components/MatchSetup";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { fetchPlayerList } from "./actions";
import { Spinner } from "react-bootstrap";
import PoolSelect from "./components/PoolSelect";
import { useEffect, useState } from "react";
import MatchContext from "./MatchContext";
import MatchResult from "./components/MatchResult";

const BESTOF = 7;

export default function Referee() {
   const { data, error, isLoading } = useSWR("refereeMaplist", fetchPlayerList);
   const router = useRouter();

   const [matchContextValue, setMatchContextValue] = useState({
      player1: {
         score: 0
      },
      player2: {
         score: 0
      },
      maps: Array.from({ length: BESTOF }).map(() => ({ map: "", winner: "" })),
      bestOf: BESTOF
   });

   useEffect(() => {
      if ((matchContextValue.player1.name && matchContextValue.player2.name) || error || isLoading)
         return;
      const p0 = Object.keys(data)[0];
      setMatchContextValue(v => ({
         ...v,
         player1: {
            ...v.player1,
            name: p0
         },
         player2: {
            ...v.player2,
            name: p0
         }
      }));
   }, [data, error, isLoading, matchContextValue]);

   if (isLoading) return <Spinner className="m-4" />;
   if (error) return router.push("/");

   return (
      <div className="d-flex flex-column gap-2">
         <MatchContext.Provider
            value={{ context: matchContextValue, setContext: setMatchContextValue }}
         >
            <div className="d-flex gap-2 flex-wrap flex-md-nowrap">
               <MatchSetup />
               <PoolSelect players={data} />
            </div>
            <MatchInfo />
            <MatchResult />
         </MatchContext.Provider>
      </div>
   );
}
