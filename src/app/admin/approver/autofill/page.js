import { Container } from "react-bootstrap";
import PoolStats from "@/components/mappool/PoolStats";
import MapList from "@/components/mappool/MapList";
import AddMapButton from "@/app/mappool/AddMapButton";

export default function Fillerpool() {
   return (
      <Container className="py-2">
         {/* <MapList
            maps={maps}
            mapActions={[
               {
                  title: "Remove",
                  action: beatmap => {}
               }
            ]}
         /> */}
         {/* <PoolStats maps={player.maps.current} /> */}
         <AddMapButton count={-1} />
      </Container>
   );
}
