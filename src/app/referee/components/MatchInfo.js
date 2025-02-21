import { useContext } from "react";
import { Card, CardBody, CardHeader, Table } from "react-bootstrap";
import MatchContext from "../matchContext";

const BESTOF = 7;

function SongRow({ picker }) {
   return (
      <tr>
         <td>{picker}</td>
         <td>Artist - Title [Version]</td>
         <td>Dropdown</td>
      </tr>
   );
}

export default function MatchInfo() {
   const { context } = useContext(MatchContext);

   return (
      <Card>
         <CardHeader>Match Info</CardHeader>
         <CardBody>
            {!context.firstPick ? (
               <div>Enter rolls!</div>
            ) : (
               <Table className="table-striped">
                  <thead>
                     <tr>
                        <th>Picked By</th>
                        <th>Song</th>
                        <th>Winner</th>
                     </tr>
                  </thead>
                  <tbody>
                     {Array.from({ length: BESTOF }).map((_, i) => (
                        <SongRow
                           key={i}
                           picker={
                              i < BESTOF - 1
                                 ? context[`player${((i + context.firstPick) % 2) + 1}`].name
                                 : "Tiebreaker"
                           }
                        />
                     ))}
                  </tbody>
               </Table>
            )}
         </CardBody>
      </Card>
   );
}
