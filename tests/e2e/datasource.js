/**
 * Datasource (scp) test
 * 
 * Run me:
 * node datasource.js [url]
 * 
 * Testing steps:
 *  - go to the Secure Copy tab
 *  - create a random datasource
 *  - reload the page and check if the added datasource is visible in the grid
 *  - delete the created datasource
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
    const user = makeid(10);
    const password = makeid(10);
    const path = "/root/backups/";
    
    const handle = (await page.waitForFunction(() => document.querySelector("#outlet > sidebar-layout").shadowRoot.querySelector("vaadin-app-layout > vaadin-tabs > vaadin-tab:nth-child(4) > a"))).asElement();
    await handle.click();

    const addDatasource = (await page.waitForFunction(() => document.querySelector("#outlet > sidebar-layout > scp-grid").shadowRoot.querySelector("vaadin-button").shadowRoot.querySelector("#button"))).asElement();
    await addDatasource.click();

    const datasourceName = (await page.waitForFunction(() => document.querySelector("#name").shadowRoot.querySelector("slot:nth-child(2) > input"))).asElement();
    await datasourceName.type(name);

    const datasourceHost = (await page.waitForFunction(() => document.querySelector("#host").shadowRoot.querySelector("slot:nth-child(2) > input"))).asElement();
    await datasourceHost.type(host);
                                                             
    const datasourcePort = (await page.waitForFunction(() => document.querySelector("#port").shadowRoot.querySelector("#vaadin-number-field-input-2 > slot:nth-child(3) > input[type=number]"))).asElement();
    await datasourcePort.type(port);

    const datasourceUser = (await page.waitForFunction(() => document.querySelectorAll("#user")[2].shadowRoot.querySelector("slot:nth-child(2) > input"))).asElement();
    await datasourceUser.type(user);

    const datasourcePassword = (await page.waitForFunction(() => document.querySelectorAll("#password")[1].shadowRoot.querySelector("slot:nth-child(2) > input"))).asElement();
    await datasourcePassword.type(password);

    const datasourcePath = (await page.waitForFunction(() => document.querySelector("#path").shadowRoot.querySelector("slot:nth-child(2) > input"))).asElement();
    await datasourcePath.type(path);

    const datasourceActive = (await page.waitForFunction(() => document.querySelector("#updateForm > form > vaadin-radio-group > vaadin-radio-button:nth-child(2)"))).asElement();
    await datasourceActive.click();

    const confirmAddDatasource = (await page.waitForFunction(() => document.querySelector("#updateForm > form > vaadin-button:nth-child(13)").shadowRoot.querySelector("#button"))).asElement();
    await confirmAddDatasource.click();

    await page.reload();
    await page.waitForFunction(() => document.querySelector("#outlet > sidebar-layout > scp-grid").shadowRoot.querySelector("vaadin-button").shadowRoot.querySelector("#button"))

    const gridHTML = await page.waitForFunction(() => document.querySelector("#outlet > sidebar-layout > scp-grid").shadowRoot.querySelector("#grid").innerHTML);
    assert.notEqual(gridHTML._remoteObject.value.indexOf(name), -1);

    const deleteDatasource = (await page.waitForFunction(() => document.querySelector("#outlet > sidebar-layout > scp-grid").shadowRoot.querySelector("#grid > vaadin-grid-cell-content:nth-last-child(1) > vaadin-button:nth-child(2)").shadowRoot.querySelector("#button"))).asElement();
    await deleteDatasource.click();

    const confirmDeleteDatasource = (await page.waitForFunction(() => document.querySelector("#updateForm > form > div:nth-child(7) > vaadin-button:nth-child(1)").shadowRoot.querySelector("#button"))).asElement();
    await confirmDeleteDatasource.click();

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