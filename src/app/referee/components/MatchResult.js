import { useContext } from "react";
import { Card, CardBody, CardHeader, CardText } from "react-bootstrap";
import MatchContext from "../MatchContext";
import useSWR from "swr";
import copyText from "./copytext";

export default function MatchResult() {
   const { context } = useContext(MatchContext);
   const { data: maps } = useSWR("refereeMaplist");

   return (
      <Card>
         <CardHeader>Match Results</CardHeader>
         <CardBody>
            <CardText
               as="pre"
               className="border rounded p-2"
               role="button"
               onClick={e => copyText(e.target.innerHTML.replace(/<br>/g, "\n"))}
            >
               Match {context.matchId}
               <br />
               {context.player1.score * 2 > context.bestOf && "**"}__{context.player1.name}__
               {context.player1.score * 2 > context.bestOf && "**"} {context.player1.score} |{" "}
               {context.player2.score} {context.player2.score * 2 > context.bestOf && "**"}__
               {context.player2.name}__{context.player2.score * 2 > context.bestOf && "**"} |{" "}
               {context.mp}
               <br />
               Rolls: {context.player1.roll} | {context.player2.roll}
            </CardText>
         </CardBody>
      </Card>
   );
}
