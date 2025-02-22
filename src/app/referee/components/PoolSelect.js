"use client";

import { Card, CardBody, CardHeader, Row, Col, FormSelect, Table } from "react-bootstrap";
import { getEnumMods } from "osu-web.js";
import copyText from "./copytext";
import { useContext } from "react";
import MatchContext from "../MatchContext";

function PoolRow({ beatmap }) {
   const mods = getEnumMods(beatmap.mods);
   return (
      <tr
         role="button"
         onClick={() => copyText(`!mp map ${beatmap.id}\n!mp mods NF ${mods.join(" ")}`)}
      >
         <td>{mods.join("") || "NM"}</td>
         <td>
            {beatmap.artist} - {beatmap.title} [{beatmap.version}]
         </td>
         <td>{beatmap.id}</td>
      </tr>
   );
}

/**
 * @param {object} props
 * @param {Player[]} props.players
 * @param {Player} props.p1
 * @param {Player} props.p2
 * @param {import("react").ChangeEventHandler<HTMLSelectElement>} props.p1Updated
 * @param {import("react").ChangeEventHandler<HTMLSelectElement>} props.p2Updated
 */
export default function PoolSelect({ players }) {
   const { context, setContext } = useContext(MatchContext);

   return (
      <Card>
         <CardHeader>Map Pools</CardHeader>
         <CardBody>
            <Row>
               <Col>
                  <FormSelect
                     value={context.player1.name}
                     onChange={e =>
                        setContext(v => ({
                           ...v,
                           player1: {
                              ...v.player1,
                              name: e.target.value
                           }
                        }))
                     }
                  >
                     {Object.keys(players).map(p => (
                        <option value={p} key={p}>
                           {p}
                        </option>
                     ))}
                  </FormSelect>
               </Col>
               <Col>
                  <FormSelect
                     value={context.player2.name}
                     onChange={e =>
                        setContext(v => ({
                           ...v,
                           player2: {
                              ...v.player2,
                              name: e.target.value
                           }
                        }))
                     }
                  >
                     {Object.keys(players).map(p => (
                        <option value={p} key={p}>
                           {p}
                        </option>
                     ))}
                  </FormSelect>
               </Col>
            </Row>
            <Row>
               <Col>
                  <hr />
               </Col>
               <Col>
                  <hr />
               </Col>
            </Row>
            <Row>
               <Col>
                  <Table className="table-sm table-hover">
                     <tbody>
                        {players[context.player1.name]?.map(beatmap => (
                           <PoolRow beatmap={beatmap} key={beatmap.id} />
                        ))}
                     </tbody>
                  </Table>
               </Col>
               <Col>
                  <Table className="table-sm table-hover">
                     <tbody>
                        {players[context.player2.name]?.map(beatmap => (
                           <PoolRow beatmap={beatmap} key={beatmap.id} />
                        ))}
                     </tbody>
                  </Table>
               </Col>
            </Row>
         </CardBody>
      </Card>
   );
}
