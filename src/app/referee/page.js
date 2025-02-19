"use client";

import MatchInfo from "./components/MatchInfo";
import SetupCommands from "./components/SetupCommands";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { fetchPlayerList } from "./actions";
import { Spinner } from "react-bootstrap";
import PoolSelect from "./components/PoolSelect";
import { useState } from "react";

export default function Referee() {
   const { data, error, isLoading } = useSWR("refereeMaplist", fetchPlayerList);
   const router = useRouter();

   const [player1, setPlayer1] = useState(Object.keys(data)[0]);
   const [player2, setPlayer2] = useState(Object.keys(data)[0]);

   if (isLoading) return <Spinner className="m-4" />;
   if (error) return router.push("/");

   return (
      <div className="d-flex flex-column gap-2">
         <div className="d-flex gap-2">
            <SetupCommands p1={{ name: player1 }} p2={{ name: player2 }} />
            <PoolSelect
               players={data}
               p1={player1}
               p2={player2}
               p1Updated={e => setPlayer1(e.target.value)}
               p2Updated={e => setPlayer2(e.target.value)}
            />
         </div>
         <MatchInfo />
      </div>
   );
}
