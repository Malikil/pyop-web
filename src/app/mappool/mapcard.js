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

import useSubmissionRequirements from "@/hooks/useSubmissionRequirements";
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
import styles from "./mappool.module.css";
import { useEffect, useState } from "react";
import { ExclamationCircle } from "react-bootstrap-icons";

/**
 * @param {object} props
 * @param {Beatmap} props.beatmap
 */
export default function MapCard(props) {
   const { mutate } = useSWRConfig();
   const { data: reqs, isLoading } = useSubmissionRequirements();
   // Check map status
   const [errorState, setErrorState] = useState({
      drain: false,
      length: false,
      stars: false,
      style: null,
      textStyle: null
   });
   useEffect(() => {
      if (isLoading) return;

      setErrorState(oldState => {
         let err = false;
         let warn = false;
         if (
            props.beatmap.drain < reqs.maps.drain.min - 10 ||
            props.beatmap.drain > reqs.maps.drain.max + 10
         ) {
            oldState.drain = true;
            err = true;
         } else if (
            props.beatmap.drain < reqs.maps.drain.min ||
            props.beatmap.drain > reqs.maps.drain.max
         ) {
            oldState.drain = true;
            warn = true;
         } else oldState.drain = false;

         if (props.beatmap.length > reqs.maps.length.max) {
            oldState.length = true;
            err = true;
         } else oldState.length = false;

         if (
            props.beatmap.stars < reqs.maps.stars.min ||
            props.beatmap.stars > reqs.maps.stars.max
         ) {
            oldState.stars = true;
            err = true;
         } else oldState.stars = false;

         return {
            ...oldState,
            style: err ? styles.map_error : warn ? styles.map_warning : null,
            textStyle: err ? "text-danger" : warn ? "text-warning" : null
         };
      });
   }, [props.beatmap, reqs]);

   return (
      <Card className={errorState.style}>
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
                  <Col className="d-flex align-items-center gap-1">
                     {(errorState.length || errorState.drain) && (
                        <ExclamationCircle className={errorState.textStyle} />
                     )}{" "}
                     <span className="d-inline-block">{convertTime(props.beatmap.length)}</span>{" "}
                     <span className="d-inline-block">
                        {props.beatmap.drain < props.beatmap.length &&
                           ` (${convertTime(props.beatmap.drain)} drain)`}
                     </span>
                  </Col>
               </Row>
               <Row>
                  <Col>BPM</Col>
                  <Col>{parseFloat(props.beatmap.bpm.toFixed(3))}</Col>
               </Row>
               <Row>
                  <Col>Stars</Col>
                  <Col className="d-flex align-items-center gap-1">
                     {errorState.stars && <ExclamationCircle className={errorState.textStyle} />}
                     <div>{props.beatmap.stars.toFixed(2)}</div>
                  </Col>
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
                           const index = player.maps.current.findIndex(
                              m => m.id === props.beatmap.id && m.mods === props.beatmap.mods
                           );
                           return {
                              ...player,
                              maps: {
                                 ...player.maps,
                                 current: player.maps.current.filter((_, i) => i !== index)
                              }
                           };
                        },
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
