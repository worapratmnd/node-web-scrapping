import * as dotenv from "dotenv";
import { scrapping, webScrapping } from "./scrapping";
import * as schedule from "node-schedule";
import {
  connectToDatabase,
  getPriceConfig,
  savePriceConfig,
  savePriceTracker,
} from "./services/database.service";
import { notify } from "./services/line.service";

async function main() {
  console.log("APP START...");
  // scrapping();
  dotenv.config();
  console.log("env DB_CONN_STRING: " + process.env.DB_CONN_STRING);
  await connectToDatabase();
}

const cron = schedule.scheduleJob("0 */5 * * * *", async () => {
  let priceConfig = await getPriceConfig();
  for (let i = 0; i < priceConfig.length; i++) {
    console.log("JOBS: " + priceConfig[i].web);
    let priceStr = await webScrapping(
      priceConfig[i].url,
      priceConfig[i].priceSelector
    );
    if (priceStr && priceStr != "") {
      let price = +priceStr?.replace(/฿/gi, "").replace(/,/gi, "");
      priceConfig[i].rawPrice = priceStr;
      priceConfig[i].price = price;
      let notifyMsg = `${priceConfig[i].web}-${priceConfig[i].itemName} : ${priceConfig[i].rawPrice}`;
      if (priceConfig[i].price !== price) {
        notify(process.env.LINE_TOKEN, "New: " + notifyMsg);
      }
      if (!priceConfig[i].highestPrice || price > priceConfig[i].highestPrice) {
        priceConfig[i].highestPrice = price;
        notify(process.env.LINE_TOKEN, "Higher: " + notifyMsg);
      }
      if (!priceConfig[i].lowestPrice || price < priceConfig[i].lowestPrice) {
        priceConfig[i].lowestPrice = price;
        notify(process.env.LINE_TOKEN, "Lower: " + notifyMsg);
      }
      savePriceConfig(priceConfig[i]);
      savePriceTracker(priceConfig[i]);
    }
    console.log("PRICE: " + priceStr);
    console.log("END: " + priceConfig[i].web);
  }
});

main();
