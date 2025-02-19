"use client";

import { Card, CardBody, CardHeader, Row, Col, FormSelect, Table } from "react-bootstrap";
import { getEnumMods } from "osu-web.js";
import copyText from "./copytext";

function PoolRow({ beatmap }) {
   const mods = getEnumMods(beatmap.mods);
   if (mods.length < 1) mods.push("NM");
   return (
      <tr
         role="button"
         onClick={() => copyText(`!mp map ${beatmap.id}\n!mp mods NF ${mods.join(" ")}`)}
      >
         <td>{mods.join("")}</td>
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
export default function PoolSelect({ players, p1, p1Updated, p2, p2Updated }) {
   return (
      <Card>
         <CardHeader>Map Pools</CardHeader>
         <CardBody>
            <Row>
               <Col>
                  <FormSelect value={p1} onChange={p1Updated}>
                     {Object.keys(players).map(p => (
                        <option value={p} key={p}>
                           {p}
                        </option>
                     ))}
                  </FormSelect>
               </Col>
               <Col>
                  <FormSelect value={p2} onChange={p2Updated}>
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
                  <Table className="table-hover">
                     <tbody>
                        {players[p1]?.map(beatmap => (
                           <PoolRow beatmap={beatmap} key={beatmap.id} />
                        ))}
                     </tbody>
                  </Table>
               </Col>
               <Col>
                  <Table className="table-hover">
                     <tbody>
                        {players[p2]?.map(beatmap => (
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
