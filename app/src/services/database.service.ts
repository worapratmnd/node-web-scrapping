import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";
import { IPriceConfig } from "../models/priceconfig.model";
import { IPriceTracker } from "../models/pricetracker.model";
export const collections: {
  priceConfig?: mongoDB.Collection;
  priceTracker?: mongoDB.Collection;
} = {};

export async function connectToDatabase() {
  dotenv.config();
  const client: mongoDB.MongoClient = new mongoDB.MongoClient(
    process.env.DB_CONN_STRING,
    {
      auth: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
      },
      authMechanism: "SCRAM-SHA-256",
      authSource: "example",
    }
  );

  await client.connect();

  const db: mongoDB.Db = client.db(process.env.DB_NAME);

  const priceConfigCollection: mongoDB.Collection =
    db.collection("price_config");

  collections.priceConfig = priceConfigCollection;

  const priceTrackerCollection: mongoDB.Collection =
    db.collection("price_tracker");

  collections.priceTracker = priceTrackerCollection;
  console.log(
    `Successfully connected to database: ${db.databaseName} and collection: ${priceConfigCollection.collectionName}`
  );
}

export async function getPriceConfig(): Promise<IPriceConfig[]> {
  collections.priceConfig.find({});
  const priceConfig = (await collections.priceConfig
    .find({})
    .toArray()) as unknown as IPriceConfig[];
  return priceConfig;
}

export async function savePriceConfig(priceConfig: IPriceConfig) {
  let result = await collections.priceConfig.updateOne(
    { _id: new mongoDB.ObjectId(priceConfig._id) },
    { $set: { ...priceConfig } }
  );
}

export async function savePriceTracker(priceConfig: IPriceConfig) {
  const tracker: IPriceTracker = {
    referId: priceConfig._id,
    price: priceConfig.price,
    rawPrice: priceConfig.rawPrice,
    timeStamp: new Date(),
  };
  await collections.priceTracker.insertOne({ ...tracker });
}
