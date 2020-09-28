const puppeteer = require("puppeteer");
const fs = require("fs");
const readline = require("readline");


// masukkin email,password dan cek cookies (cek file config untuk pengaturan)
const config = require("./config.json");
const cookies = require("./cookies.json");  
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});



// jalanin fungsi asynchronous langsung
(async () => {
// headless : false, kalau mau liat cara jalannya

  const browser = await puppeteer.launch({ headless: true });  
  const context = browser.defaultBrowserContext();
  context.overridePermissions("https://www.facebook.com", []);
  const page = await browser.newPage();
  await page.setViewport({
    width: 411,
    height: 731,
    deviceScaleFactor: 1,
    isMobile: true,
  });
  await page.setDefaultNavigationTimeout(120000);
  function isEmpty(value) {
    return value == null || value.length === 0;
  }

  console.log("\nScript Running in background... \nThis Repository is fun playground, feel free to pr / others\nStar appreciated :)\nWait for the loading (depend on ur internet/host internet if you running on vps)\n")
// cek cookies / udh pernah login belum
  if (isEmpty(cookies)) {
    console.log("ga ada cookies");
    await page.goto("https://www.facebook.com/login", {
      waitUntil: "networkidle2",
    });
    await page.type("#email", config.email, { delay: 30 });
    await page.type("#pass", config.password, { delay: 40 });
    await page.click("#loginbutton");
    await page.waitForNavigation({ waitUntil: "networkidle2" });
    let currentCookies = await page.cookies();
    fs.writeFileSync("./cookies.json", JSON.stringify(currentCookies));
  } else {
    await page.setCookie(...cookies);
  }
    await page.goto("https://m.facebook.com/", { waitUntil: "networkidle2" });
    // selector post area
    let post_temp = "._4g34 _6ber _78cq _7cdk _5i2i _52we";
    const post = post_temp.replace(/[\s]/gim, ".");
    await page.click(post);
    await page.waitForNavigation({ waitUntil: "networkidle0" });
  
  // Cek command line, masukkan postingan
   rl.question("Mau Post Apa ?\n", async function(message) {
    const textBox = "#uniqid_1";
    await page.type(textBox, message, { delay: 20 });
    await page.focus(textBox);
    await page.evaluate(() =>
      document.querySelector('button[value="Post"]').click());
    console.log(`post success with message = ${message}` );
  rl.close();
  browser.close();
    });
    
})();
