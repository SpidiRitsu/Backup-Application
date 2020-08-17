/**
 * User test
 * 
 * Run me:
 * node backup.js [url]
 * 
 * Testing steps:
 *  - go to the Users tab
 *  - create a random user
 *  - reload the page and check if the added user is visible in the grid
 *  - delete the created user
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
    
    const testUsername = makeid(5);
    const testPassword = 'test123';

    const handle = (await page.waitForFunction(() => document.querySelector("#outlet > sidebar-layout").shadowRoot.querySelector("vaadin-app-layout > vaadin-tabs > vaadin-tab:nth-child(3) > a"))).asElement();
    await handle.click();
    
    const addUser = (await page.waitForFunction(() => document.querySelector("#outlet > sidebar-layout > users-grid").shadowRoot.querySelector("vaadin-button").shadowRoot.querySelector("#button"))).asElement();
    await addUser.click();
    
    const username = (await page.waitForFunction(() => document.querySelector("#username").shadowRoot.querySelector("#vaadin-text-field-input-0 > slot:nth-child(2) > input"))).asElement();
    await username.type(testUsername);

    const password = (await page.waitForFunction(() => document.querySelectorAll("#password")[1].shadowRoot.querySelector("#vaadin-password-field-input-1 > slot:nth-child(2) > input[type=password]"))).asElement();
    await password.type(testPassword);
    
    const updateButton = (await page.waitForFunction(() => document.querySelector("#updateForm > form > vaadin-button:nth-child(6)").shadowRoot.querySelector("#button"))).asElement();
    await updateButton.click();

    await page.reload();
    await page.waitForFunction(() => document.querySelector("#outlet > sidebar-layout > users-grid").shadowRoot.querySelector("vaadin-button").shadowRoot.querySelector("#button"))
    
    const gridHTML = await page.waitForFunction(() => document.querySelector("#outlet > sidebar-layout > users-grid").shadowRoot.querySelector("#grid").innerHTML);
    assert.notEqual(gridHTML._remoteObject.value.indexOf(testUsername), -1);
    
    const deleteUser = (await page.waitForFunction(() => document.querySelector("#outlet > sidebar-layout > users-grid").shadowRoot.querySelector("#grid > vaadin-grid-cell-content:nth-last-child(1) > vaadin-button:nth-child(2)").shadowRoot.querySelector("#button"))).asElement();
    await deleteUser.click();

    const confirmDeleteUser = (await page.waitForFunction(() => document.querySelector("#updateForm > form > div:nth-child(7) > vaadin-button:nth-child(1)").shadowRoot.querySelector("#button"))).asElement();
    await confirmDeleteUser.click();

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