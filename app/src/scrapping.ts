import puppeteer, { executablePath } from "puppeteer";

let browser;

export async function webScrapping(
  url: string,
  focusEl: string
): Promise<string> {
  let browser = await getBrowser();
  const page = await browser.newPage();

  await page.goto(url);
  const resultsSelector = focusEl;
  await page.waitForSelector(resultsSelector, { visible: true });
  // await page.waitForTimeout(1000);
  const result = await page.evaluate((resultsSelector) => {
    return document.querySelector(resultsSelector).textContent;
  }, resultsSelector);
  await page.close();
  // await browser.close();

  return result;
}

async function getBrowser(): Promise<puppeteer.Browser> {
  if (browser) {
    return browser;
  }

  if (process.env.ENV_MODE.toUpperCase() === "PROD") {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
      timeout: 0,
    });
  } else {
    browser = await puppeteer.launch();
  }
  return browser;
}

// scrapping();
