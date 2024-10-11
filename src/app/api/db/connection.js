import { MongoClient, ServerApiVersion } from "mongodb";

export const client = new MongoClient(process.env.MONGO_CONNECTION, {
   serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true
   }
});
export const db = client.db("pyop");
