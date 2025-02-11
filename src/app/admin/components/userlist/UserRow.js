"use client";

import Image from "next/image";
import { buildUrl } from "osu-web.js";
import { useState } from "react";
import { updateStatus } from "./actions";
import { Spinner } from "react-bootstrap";

export default function UserRow({ user }) {
   const [waiting, setWaiting] = useState(false);
   const [admin, setAdmin] = useState(!!user.admin);
   const [approver, setApprover] = useState(!!user.approver);
   const [referee, setReferee] = useState(!!user.referee);
   const [eliminated, setEliminated] = useState(!!user.eliminated);
   return (
      <tr>
         <td className="py-1">
            {waiting ? (
               <Spinner />
            ) : (
               <Image src={buildUrl.userAvatar(user.osuid)} alt="Avatar" width={32} height={32} />
            )}
         </td>
         <td className="px-2">{user.osuid}</td>
         <td className="px-2">
            <div className="form-check form-switch">
               <input
                  className="form-check-input"
                  type="checkbox"
                  role="button"
                  checked={admin}
                  onChange={() => {
                     setWaiting(true);
                     setAdmin(v => {
                        updateStatus(user.osuid, "admin", !v).then(() => setWaiting(false));
                        return !v;
                     });
                  }}
                  disabled={waiting}
               />
            </div>
         </td>
         <td className="px-2">
            <div className="form-check form-switch">
               <input
                  className="form-check-input"
                  type="checkbox"
                  role="button"
                  checked={approver}
                  onChange={() => {
                     setWaiting(true);
                     setApprover(v => {
                        updateStatus(user.osuid, "approver", !v).then(() => setWaiting(false));
                        return !v;
                     });
                  }}
                  disabled={waiting}
               />
            </div>
         </td>
         <td className="px-2">
            <div className="form-check form-switch">
               <input
                  className="form-check-input"
                  type="checkbox"
                  role="button"
                  checked={referee}
                  onChange={() => {
                     setWaiting(true);
                     setReferee(v => {
                        updateStatus(user.osuid, "referee", !v).then(() => setWaiting(false));
                        return !v;
                     });
                  }}
                  disabled={waiting}
               />
            </div>
         </td>
         <td className="px-2">
            <div className="form-check form-switch">
               <input
                  className="form-check-input"
                  type="checkbox"
                  role="button"
                  checked={eliminated}
                  onChange={() => {
                     setWaiting(true);
                     setEliminated(v => {
                        updateStatus(user.osuid, "eliminated", !v).then(() => setWaiting(false));
                        return !v;
                     });
                  }}
                  disabled={waiting}
               />
            </div>
         </td>
      </tr>
   );
}
