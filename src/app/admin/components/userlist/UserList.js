import db from "@/app/api/db/connection";
import { Card, CardBody, CardTitle } from "react-bootstrap";
import UserRow from "./UserRow";

export default async function UserList() {
   const playersCollection = db.collection("players");
   const users = playersCollection.find(
      {},
      { projection: { _id: 0, maps: 0 }, sort: { eliminated: 1, referee: -1 } }
   );
   const userlist = await users.map(user => <UserRow user={user} key={user.osuid} />).toArray();
   return (
      <Card>
         <CardBody>
            <CardTitle>Users ({userlist.length})</CardTitle>
            <table>
               <thead>
                  <tr>
                     <th></th>
                     <th className="text-center px-1">Osu ID</th>
                     <th className="px-1">Admin</th>
                     <th className="px-1">Approver</th>
                     <th className="px-1">Referee</th>
                     <th className="px-1">Eliminated</th>
                  </tr>
               </thead>
               <tbody>{userlist}</tbody>
            </table>
         </CardBody>
      </Card>
   );
}
