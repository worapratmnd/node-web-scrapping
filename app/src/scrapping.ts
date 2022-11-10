import puppeteer, { executablePath } from "puppeteer";

const scrappingExample = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto("https://developers.google.com/web/");

  // Type into search box.
  await page.type(".devsite-search-field", "Headless Chrome");

  // Wait for suggest overlay to appear and click "show all results".
  const allResultsSelector = ".devsite-suggest-all-results";
  await page.waitForSelector(allResultsSelector);
  await page.click(allResultsSelector);

  // Wait for the results page to load and display the results.
  const resultsSelector = ".gsc-results .gs-title";
  await page.waitForSelector(resultsSelector);

  // Extract the results from the page.
  const links = await page.evaluate((resultsSelector) => {
    return [...document.querySelectorAll(resultsSelector)].map(
      (anchor: any) => {
        const title = anchor.textContent.split("|")[0].trim();
        return `${title} - ${anchor.href}`;
      }
    );
  }, resultsSelector);

  // Print all the files.
  console.log(links.join("\n"));

  await browser.close();
};

export const scrapping = async () => {
  let browser;
  if (process.env.ENV_MODE.toUpperCase() === "PROD") {
    console.log("Browser PROD");
    browser = await puppeteer.launch({
      executablePath: "/usr/bin/chromium-browser",
    });
  } else {
    browser = await puppeteer.launch();
  }
  const page = await browser.newPage();

  await page.goto(
    "https://shopee.co.th/LG-Ultragear-Gaming-Monitor23.8-24GN600-B.ATM-IPS-1Ms-144Hz-FHD-MNL-001513-%E0%B8%88%E0%B8%AD%E0%B8%A1%E0%B8%AD%E0%B8%99%E0%B8%B4%E0%B9%80%E0%B8%95%E0%B8%AD%E0%B8%A3%E0%B9%8C-i.25344508.2919903226?sp_atk=337bb2a0-a61c-4c2e-8d1f-520bf7bf3a14&xptdk=337bb2a0-a61c-4c2e-8d1f-520bf7bf3a14"
  );

  const resultsShopeeSelector = "._2Shl1j";
  await page.waitForSelector(resultsShopeeSelector);
  const priceShopeeTrack = await page.evaluate((resultsSelector) => {
    return document.querySelector("._2Shl1j").textContent;
  }, resultsShopeeSelector);
  console.log("SHOPEE - " + priceShopeeTrack);

  await page.goto(
    "https://www.lazada.co.th/products/lg-ultragear-24gn600-24-fhd-1920x1080-1msgtg-144hzhdr10-freesyncpremium-i2210058122-s7414406645.html?clickTrackInfo=undefined&search=1&spm=a2o4m.searchlist.list.i40.2a617184VB4de7"
  );
  const resultsLazadaSelector = ".pdp-price";
  await page.waitForSelector(resultsLazadaSelector);
  const priceLazadaTrack = await page.evaluate((resultsSelector) => {
    return document.querySelector(".pdp-price").textContent;
  }, resultsLazadaSelector);
  console.log("Lazada: " + priceLazadaTrack);

  console.log("END");
  await browser.close();
};

export async function webScrapping(
  url: string,
  focusEl: string
): Promise<string> {
  let browser;
  if (process.env.ENV_MODE.toUpperCase() === "PROD") {
    console.log("Browser PROD");
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
    });
  } else {
    browser = await puppeteer.launch();
  }
  const page = await browser.newPage();

  await page.goto(url);
  const resultsSelector = focusEl;
  await page.waitForSelector(resultsSelector);
  const result = await page.evaluate((resultsSelector) => {
    // console.log("resultsSelector: ", resultsSelector);
    // return "World";
    return document.querySelector(resultsSelector).textContent;
  }, resultsSelector);
  await browser.close();

  return result;
}

// scrapping();
