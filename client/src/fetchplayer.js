import { MongoClient, ServerApiVersion } from "mongodb";

const client = new MongoClient(process.env.MONGO_CONNECTION, {
   serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true
   }
});
const db = client.db("pyop");

export const getPlayer = async username => {
   const collection = db.collection("players");
   const player = await collection.findOne({ username });
   return player;
};
