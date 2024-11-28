import { ExclamationCircle } from "react-bootstrap-icons";
import styles from "./mappool.module.css";

export default function MappoolNotify() {
   return (
      <div className={styles.notify}>
         <ExclamationCircle className="text-warning" />
         <div>osu! access token expired</div>
      </div>
   );
}
