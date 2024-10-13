import { convertTime } from "@/time";
import styles from "./mappool.module.css";
import useSubmissionRequirements from "@/hooks/useSubmissionRequirements";

export default function PoolStats({ maps }) {
   const { data, isLoading } = useSubmissionRequirements();
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
                  Star Rating: {data.maps.stars.min.toFixed(2)} - {data.maps.stars.max.toFixed(2)}
               </div>
               <div>
                  Drain Time: {convertTime(data.maps.drain.min)} -{" "}
                  {convertTime(data.maps.drain.max)}
               </div>
               <div>Song Length: &lt;{convertTime(data.maps.length.max)} (incl. DT/HT)</div>
               <div>3 scoreboard passes or screenshot</div>
               <hr />
               <h5>Pool Requirements:</h5>
               <div>
                  Total Time: 18:20 - 32:30 (
                  <span
                     className={
                        (agg.drain < data.pool.drain.min || agg.drain > data.pool.drain.max
                           ? "text-danger"
                           : "text-success") + " fw-bold"
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
