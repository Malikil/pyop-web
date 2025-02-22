import { useContext } from "react";
import { Card, CardBody, CardHeader, FormSelect, Table } from "react-bootstrap";
import MatchContext from "../MatchContext";
import useSWR from "swr";

const BESTOF = 7;

function SongRow({ picker, maps }) {
   return (
      <tr>
         <td>{picker}</td>
         <td>
            <FormSelect>
               <option />
               {maps.map(m => (
                  <option value={m.id} key={m.id}>
                     {m.artist} - {m.title} [{m.version}]
                  </option>
               ))}
            </FormSelect>
         </td>
         <td>Dropdown</td>
      </tr>
   );
}

export default function MatchInfo() {
   const { context } = useContext(MatchContext);
   const { data } = useSWR("refereeMaplist");

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
                     {Array.from({ length: BESTOF }).map((_, i) => {
                        const pnum = ((i + context.firstPick) % 2) + 1;
                        const oppnum = (pnum % 2) + 1;
                        const pname = i < BESTOF - 1 ? context[`player${pnum}`].name : "Tiebreaker";
                        const oppname =
                           i < BESTOF - 1 ? context[`player${oppnum}`].name : "Tiebreaker";
                        return (
                           <SongRow key={i} picker={pname} maps={(data || {})[oppname] || []} />
                        );
                     })}
                  </tbody>
               </Table>
            )}
         </CardBody>
      </Card>
   );
}
