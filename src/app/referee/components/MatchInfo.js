import { useContext } from "react";
import { Card, CardBody, CardHeader, FormSelect, Table } from "react-bootstrap";
import MatchContext from "../MatchContext";
import useSWR from "swr";

function SongRow({ picker, maps, song, songChanged, players, winner, winnerChanged }) {
   return (
      <tr>
         <td>{picker}</td>
         <td>
            <FormSelect value={song} onChange={songChanged}>
               <option />
               {maps.map(m => (
                  <option value={m.id} key={m.id}>
                     {m.artist} - {m.title} [{m.version}]
                  </option>
               ))}
            </FormSelect>
         </td>
         <td>
            <FormSelect value={winner} onChange={winnerChanged}>
               <option />
               {players.map(p => (
                  <option value={p} key={p}>
                     {p}
                  </option>
               ))}
            </FormSelect>
         </td>
      </tr>
   );
}

export default function MatchInfo() {
   const { context, setContext } = useContext(MatchContext);
   const { data } = useSWR("refereeMaplist");

   return (
      <Card>
         <CardHeader>Match Info</CardHeader>
         <CardBody>
            {!context.player1.roll || !context.player2.roll ? (
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
                     {Array.from({ length: context.bestOf }).map((_, i) => {
                        const firstPick = +(context.player1.roll < context.player2.roll);
                        const pnum = ((i + firstPick) % 2) + 1;
                        const oppnum = (pnum % 2) + 1;
                        const pname =
                           i < context.bestOf - 1 ? context[`player${pnum}`].name : "Tiebreaker";
                        const oppname =
                           i < context.bestOf - 1 ? context[`player${oppnum}`].name : "Tiebreaker";
                        return (
                           <SongRow
                              key={i}
                              picker={pname}
                              maps={(data || {})[oppname] || []}
                              song={context.maps[i].map}
                              songChanged={e =>
                                 setContext(v => {
                                    const selectedList = [...v.maps];
                                    selectedList[i].map = e.target.value;
                                    return {
                                       ...v,
                                       maps: selectedList
                                    };
                                 })
                              }
                              players={[context.player1.name, context.player2.name]}
                              winner={context.maps[i].winner}
                              winnerChanged={e =>
                                 setContext(v => {
                                    const winnerList = [...v.maps];
                                    winnerList[i].winner = e.target.value;
                                    const p1Score = winnerList.filter(
                                       m => m.winner === v.player1.name
                                    ).length;
                                    const p2Score = winnerList.filter(
                                       m => m.winner === v.player2.name
                                    ).length;
                                    return {
                                       ...v,
                                       player1: {
                                          ...v.player1,
                                          score: p1Score
                                       },
                                       player2: {
                                          ...v.player2,
                                          score: p2Score
                                       },
                                       maps: winnerList
                                    };
                                 })
                              }
                           />
                        );
                     })}
                  </tbody>
               </Table>
            )}
         </CardBody>
      </Card>
   );
}
