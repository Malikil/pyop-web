import { convertTime } from "@/time";
import styles from "./mappool.module.css";
import useMapRequirements from "@/hooks/useMapRequirements";

export default function PoolStats({ maps }) {
   const { data, isLoading } = useMapRequirements();
   const agg = maps.reduce(
      (p, c) => ({
         drain: p.drain + c.drain,
         drainBuffer:
            p.drainBuffer + ((c.drain < 60 && c.drain >= 50) || (c.drain > 315 && c.drain <= 325))
      }),
      {
         drain: 0,
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
                        (agg.drain < 1100 || agg.drain > 1950 ? "text-danger" : "text-success") +
                        " fw-bold"
                     }
                  >
                     {convertTime(agg.drain)}
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
