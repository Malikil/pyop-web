/**
 * @typedef Beatmap
 * @prop {number} id
 * @prop {number} setid
 * @prop {string} artist
 * @prop {string} title
 * @prop {string} version
 * @prop {number} length
 * @prop {number} drain
 * @prop {number} bpm
 * @prop {number} cs
 * @prop {number} ar
 * @prop {number} stars
 * @prop {number} mods
 */

import { convertTime } from "@/time";
import {
   Card,
   CardBody,
   CardImg,
   CardLink,
   CardSubtitle,
   CardTitle,
   Col,
   Container,
   Row
} from "react-bootstrap";
import { useSWRConfig } from "swr";

/**
 * @param {object} props
 * @param {Beatmap} props.beatmap
 */
export default function MapCard(props) {
   const { mutate } = useSWRConfig();
   return (
      <Card>
         <CardBody>
            <CardImg
               src={`https://assets.ppy.sh/beatmaps/${props.beatmap.setid}/covers/cover.jpg`}
               alt="Cover"
               style={{ minHeight: "100px", objectFit: "cover" }}
            />
            <CardTitle className="mt-1">
               {props.beatmap.artist} - {props.beatmap.title}
            </CardTitle>
            <CardSubtitle className="d-flex">
               <div>{props.beatmap.version}</div>
               <div className="ml-auto">{props.beatmap.id}</div>
            </CardSubtitle>
            <Container className="mb-auto">
               <Row>
                  <Col>Length</Col>
                  <Col>
                     {convertTime(props.beatmap.length)}
                     {props.beatmap.drain < props.beatmap.length && ` (${convertTime(props.beatmap.drain)} drain)`}
                  </Col>
               </Row>
               <Row>
                  <Col>BPM</Col>
                  <Col>{parseFloat(props.beatmap.bpm.toFixed(3))}</Col>
               </Row>
               <Row>
                  <Col>Stars</Col>
                  <Col>{props.beatmap.stars.toFixed(2)}</Col>
               </Row>
               <Row>
                  <Col>CS</Col>
                  <Col>{props.beatmap.cs}</Col>
               </Row>
               <Row>
                  <Col>AR</Col>
                  <Col>{parseFloat(props.beatmap.ar.toFixed(2))}</Col>
               </Row>
            </Container>
            <CardLink
               href={`https://osu.ppy.sh/beatmapsets/${props.beatmap.setid}#osu/${props.beatmap.id}`}
               target="_blank"
               rel="noopener noreferrer"
            >
               Beatmap
            </CardLink>
            <CardLink
               role="button"
               onClick={() =>
                  mutate(
                     "/api/db/player",
                     () =>
                        fetch(`/api/db/maps?id=${props.beatmap.id}&mods=${props.beatmap.mods}`, {
                           method: "DELETE"
                        }).then(res => res.json()),
                     {
                        optimisticData: player => {
                           const index = player.maps.current.findIndex(m => m.id === props.beatmap.id && m.mods === props.beatmap.mods)
                           return {
                           ...player,
                           maps: {
                              ...player.maps,
                              current: player.maps.current.filter(
                                 (_, i) => i !== index
                              )
                           }
                        }},
                        populateCache: (result, player) => ({
                           ...player,
                           maps: {
                              ...player.maps,
                              current: result
                           }
                        })
                     }
                  )
               }
            >
               Remove
            </CardLink>
         </CardBody>
      </Card>
   );
}
