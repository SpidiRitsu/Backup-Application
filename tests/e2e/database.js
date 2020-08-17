/**
 * Database test
 * 
 * Run me:
 * node database.js [url]
 * 
 * Testing steps:
 *  - go to the Databases tab
 *  - create a random database
 *  - reload the page and check if the added database is visible in the grid
 *  - delete the created database
 */

const puppeteer = require('puppeteer');
const assert = require('assert');

if (process.argv.length != 3) {
  console.log('This test requires a [url] parameter!');
  console.log('\nExample:');
  console.log('node backup.js https://localhost:5000')
  process.exit(1);
}

(async () => {
  try {
    let options = { args: ['--no-sandbox', `--window-size=1920,1080`], headless: false };
    if(process.env.EXTERNAL_CHROMIUM) options.executablePath = '/usr/bin/chromium-browser';
    const browser = await puppeteer.launch(options)
    const page = await browser.newPage();

    await page.goto(process.argv[2]);

    await page.setViewport({ width: 1920, height: 1080 });
    
    const name = makeid(10);
    const host = makeid(12);
    const port = between(3000, 4000).toString();
    const database = makeid(10);
    const user = makeid(10);
    const password = makeid(10);
    const cron = "* * * * *";

    const handle = (await page.waitForFunction(() => document.querySelector("#outlet > sidebar-layout").shadowRoot.querySelector("vaadin-app-layout > vaadin-tabs > vaadin-tab:nth-child(2) > a"))).asElement();
    await handle.click();

    const addDatabase = (await page.waitForFunction(() => document.querySelector("#outlet > sidebar-layout > databases-grid").shadowRoot.querySelector("vaadin-button").shadowRoot.querySelector("#button"))).asElement();
    await addDatabase.click();

    const databaseName = (await page.waitForFunction(() => document.querySelector("#name").shadowRoot.querySelector("slot:nth-child(2) > input"))).asElement();
    await databaseName.type(name);

    const databaseHost = (await page.waitForFunction(() => document.querySelector("#host").shadowRoot.querySelector("slot:nth-child(2) > input"))).asElement();
    await databaseHost.type(host);

    const databasePort = (await page.waitForFunction(() => document.querySelector("#port").shadowRoot.querySelector("slot:nth-child(3) > input[type=number]"))).asElement();
    await databasePort.type(port);

    const databaseDatabase = (await page.waitForFunction(() => document.querySelectorAll("#database")[1].shadowRoot.querySelector("slot:nth-child(2) > input"))).asElement();
    await databaseDatabase.type(database);

    const databaseUser = (await page.waitForFunction(() => document.querySelectorAll("#user")[2].shadowRoot.querySelector("slot:nth-child(2) > input"))).asElement();
    await databaseUser.type(user);

    const databasePassword = (await page.waitForFunction(() => document.querySelectorAll("#password")[1].shadowRoot.querySelector("slot:nth-child(2) > input[type=password]"))).asElement();
    await databasePassword.type(password);

    const databaseCron = (await page.waitForFunction(() => document.querySelector("#cron").shadowRoot.querySelector("slot:nth-child(2) > input"))).asElement();
    await databaseCron.type(cron);

    const databaseActive = (await page.waitForFunction(() => document.querySelector("#updateForm > form > vaadin-radio-group > vaadin-radio-button:nth-child(2)"))).asElement();
    await databaseActive.click();

    const databaseAdd = (await page.waitForFunction(() => document.querySelector("#updateForm > form > vaadin-button:nth-child(15)").shadowRoot.querySelector("#button"))).asElement();
    await databaseAdd.click();

    await page.reload();
    await page.waitForFunction(() => document.querySelector("#outlet > sidebar-layout > databases-grid").shadowRoot.querySelector("vaadin-button").shadowRoot.querySelector("#button"));

    const gridHTML = await page.waitForFunction(() => document.querySelector("#outlet > sidebar-layout > databases-grid").shadowRoot.querySelector("#grid").innerHTML);
    assert.notEqual(gridHTML._remoteObject.value.indexOf(name), -1);

    const deleteDatabase = (await page.waitForFunction(() => document.querySelector("#outlet > sidebar-layout > databases-grid").shadowRoot.querySelector("#grid > vaadin-grid-cell-content:nth-last-child(1) > vaadin-button:nth-child(3)").shadowRoot.querySelector("#button"))).asElement();
    await deleteDatabase.click();

    const confirmDeleteDatabase = (await page.waitForFunction(() => document.querySelector("#updateForm > form > div:nth-child(7) > vaadin-button:nth-child(1)").shadowRoot.querySelector("#button"))).asElement();
    await confirmDeleteDatabase.click();

    await sleep(100);

    console.log("Test passed!");
    process.exit(0);
  } catch(err) {
    console.log(err)
    console.error('Test failed!');
    process.exit(1);
  }
})();
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function between(min, max) {  
  return Math.floor(
    Math.random() * (max - min) + min
  )
}