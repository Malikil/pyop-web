"use client";

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
 * @prop {'pending'|'approved'|'rejected'} approval
 * @prop {string} [rejection]
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
import styles from "./mappool.module.css";
import { useEffect, useState } from "react";
import { CheckCircle, ExclamationCircle, QuestionCircle } from "react-bootstrap-icons";
import { getEnumMods } from "osu-web.js";

/**
 * @param {object} props
 * @param {Beatmap} props.beatmap
 * @param {boolean} props.showMods
 * @param {object[]} [props.mapActions]
 * @param {string} props.mapActions.title
 * @param {function} props.mapActions.action
 * @param {function} props.mapActions.condition
 * @param {boolean} [props.mapActions.confirm]
 */
export default function MapCard(props) {
   const { data: reqs, isLoading } = useSubmissionRequirements();
   const [actionsConfirmation, setActionsConfirmation] = useState({});
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
            props.beatmap.drain < reqs.maps.drain.min - reqs.maps.drain.buffer ||
            props.beatmap.drain > reqs.maps.drain.max + reqs.maps.drain.buffer
         ) {
            oldState.drain = true;
            oldState.textStyle = "text-danger";
            err = true;
         } else if (
            props.beatmap.drain < reqs.maps.drain.min ||
            props.beatmap.drain > reqs.maps.drain.max
         ) {
            oldState.drain = true;
            oldState.textStyle = "text-warning";
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

         // If the beatmap needs and is missing a screenshot, put the yellow border around it
         if (props.beatmap.approval === "pending" && !props.beatmap.screenshot) warn = true;
         else if (props.beatmap.approval === "rejected") err = true;

         return {
            ...oldState,
            style: err ? styles.map_error : warn ? styles.map_warning : null
         };
      });
   }, [props.beatmap, reqs]);

   return (
      <Card className={`${styles.mapcard} ${errorState.style}`}>
         <CardBody className="d-flex flex-column">
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
               {props.showMods && (
                  <div className="ms-2">+{getEnumMods(props.beatmap.mods).join("")}</div>
               )}
               <div className="ms-auto">{props.beatmap.id}</div>
            </CardSubtitle>
            <Container>
               <Row>
                  <Col>Length</Col>
                  <Col className="d-flex flex-wrap align-items-center gap-1">
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
                     {errorState.stars && <ExclamationCircle className="text-danger" />}
                     <div>{props.beatmap.stars.toFixed(2)}</div>
                  </Col>
               </Row>
               <Row>
                  <Col>CS</Col>
                  <Col>{parseFloat(props.beatmap.cs.toFixed(2))}</Col>
               </Row>
               <Row>
                  <Col>AR</Col>
                  <Col>{parseFloat(props.beatmap.ar.toFixed(2))}</Col>
               </Row>
               {props.beatmap.rejection && (
                  <Row className="my-2">
                     <Col>Rejection: {props.beatmap.rejection}</Col>
                  </Row>
               )}
            </Container>
            <div className="mt-auto d-flex flex-wrap">
               <CardLink
                  href={`https://osu.ppy.sh/beatmapsets/${props.beatmap.setid}#osu/${props.beatmap.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
               >
                  Beatmap
               </CardLink>
               {props.mapActions
                  ?.map(fn =>
                     !fn.condition || fn.condition(props.beatmap) ? (
                        <CardLink
                           key={fn.title}
                           role="button"
                           onClick={() => {
                              if (!fn.confirm || actionsConfirmation[fn.title]) fn.action(props.beatmap);
                              else setActionsConfirmation(ac => ({ ...ac, [fn.title]: true }));
                           }}
                        >
                           {actionsConfirmation[fn.title] && (
                              <ExclamationCircle className="text-warning" />
                           )}
                           {fn.title}
                        </CardLink>
                     ) : null
                  )
                  .filter(p => p)}
               <CardLink className="text-reset text-decoration-none ms-auto">
                  {props.beatmap.approval === "approved" ? (
                     <CheckCircle className="text-success" title="Approved" />
                  ) : props.beatmap.approval === "rejected" ||
                    errorState.style === styles.map_error ? (
                     <ExclamationCircle className="text-danger" title="Rejected" />
                  ) : (
                     <QuestionCircle className="text-warning" title="Pending" />
                  )}
               </CardLink>
            </div>
         </CardBody>
      </Card>
   );
}
