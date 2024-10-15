import { DashCircle } from "react-bootstrap-icons";
import MapCard from "./MapCard";
import { Card, CardBody, CardImg, CardTitle, Col, Row } from "react-bootstrap";

/**
 * @param {object} props
 * @param {string} props.mod
 * @param {import("./MapCard").Beatmap[]} props.maps
 * @param {number} [props.minCount]
 * @param {boolean} props.showMods
 */
export default function ModPool(props) {
   return (
      <div>
         <h2>{props.mod}</h2>
         <div className="d-flex gap-2 flex-wrap flex-md-nowrap">
            {props.maps.map(m => (
               <MapCard beatmap={m} key={m.id} showMods={props.showMods} />
            ))}
            {Array.from({ length: (props.minCount || 0) - props.maps.length }).map((_, i) => (
               <Card key={-i}>
                  <CardBody className="d-flex flex-column">
                     <CardImg
                        src="/placeholder_cover.png"
                        alt="Cover"
                        style={{ minHeight: "100px", objectFit: "cover" }}
                     />
                     <CardTitle className="mt-1">Add a beatmap</CardTitle>
                     <Row className="flex-fill">
                        <Col className="text-center my-auto">
                           <DashCircle height="auto" width="15%" />
                        </Col>
                     </Row>
                  </CardBody>
               </Card>
            ))}
         </div>
      </div>
   );
}
