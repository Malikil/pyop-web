import { convertTime } from "@/time";
import styles from "./mappool.module.css";
import useMapRequirements from "@/hooks/useMapRequirements";

export default function PoolStats({ maps }) {
   const { data, isLoading } = useMapRequirements();
   const agg = maps.reduce(
      (p, c) => ({
         length: p.length + c.length,
         drainBuffer:
            p.drainBuffer +
            ((c.length < 60 && c.length >= 50) || (c.length > 315 && c.length <= 325))
      }),
      {
         length: 0,
         drainBuffer: 0
      }
   );
   return (
      <>
         {!isLoading && (
            <div className={styles.poolstats}>
               <h5>Map Requirements:</h5>
               <div>
                  Star Rating: {data.maps.min.toFixed(2)} - {data.maps.max.toFixed(2)}
               </div>
               <div>Drain Time: 1:00 - 5:15</div>
               <div>Song Length: &lt;6:00 (incl. DT/HT)</div>
               <div>3 scoreboard passes or screenshot</div>
               <hr />
               <h5>Pool Requirements:</h5>
               <div>
                  Total Time: 18:20 - 32:30 (
                  <span
                     className={
                        (agg.length < 1100 || agg.length > 1950 ? "text-danger" : "text-success") +
                        " fw-bold"
                     }
                  >
                     {convertTime(agg.length)}
                  </span>
                  )
               </div>
               {agg.drainBuffer > 2 && (
                  <div className="text-danger">Only 2 maps may be outside drain limits</div>
               )}
            </div>
         )}
      </>
   );
}
