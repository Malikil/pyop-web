import { MongoClient, ServerApiVersion } from "mongodb";

console.log("Create mongo connection");
const client = new MongoClient(process.env.MONGO_CONNECTION, {
   serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true
   }
});
const db = client.db("pyop");

export default db;
