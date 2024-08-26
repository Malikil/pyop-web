import MapCard from "./mapcard";

/**
 * @param {object} props
 * @param {string} props.mod
 * @param {import("./mapcard").Beatmap[]} props.maps
 */
export default function ModPool(props) {
   return (
      <div>
         <h2>{props.mod}</h2>
         <div className="d-flex gap-2 flex-wrap flex-md-nowrap">
            {props.maps.map(m => (
               <MapCard beatmap={m} key={m.id} />
            ))}
         </div>
      </div>
   );
}
