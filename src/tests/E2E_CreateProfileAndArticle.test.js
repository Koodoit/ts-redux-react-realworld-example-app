const puppeteer = require('puppeteer');
const assert = require('assert');
const date = Date.now();

//const devices = require('./config/DeviceDescriptors');

console.log('--- Test Started ---')
let browser;
let page;

before(async () => {
    browser = await puppeteer.launch({headless: false, slowMo: 5, defaultViewport: null, args: ['--start-maximized']}); //Change headless to true for headless mode //Change slowMo for speed
    page = await browser.newPage();
  })

describe("Conduit - Create New Account and Post an Article", () => {
    it("Conduit_E2E01h_01_Launch_Conduit", async () => {
        await page.goto("http://localhost:3000/#/"); //Navigate to page
        
        try { 
            await page.waitForSelector(".preview-link", {timeout:1000}); //Waits for entire page to load
            await page.screenshot({ path: "src/tests/Screenshots/pass/Conduit_E2E01h_01_LandingPage.png" }); //Takes screenshot of landing page
            const PageTitle = await page.$eval("h1.logo-font", txt => txt.textContent); //Captures title from h1 banner
            assert.strictEqual(PageTitle, "conduit", "Cannot find Conduit's landing page or has recently changed."); //Verifies title is correct
        } catch (err) {
            await page.screenshot({ path: "src/tests/Screenshots/fail/FAIL-Conduit_E2E01h_01_LandingPage.png" }); //Takes screenshot of landing page
            assert.fail("Cannot load Conduit's landing page or has recently changed.")
            }
        }
    );

    it("Conduit_E2E01h_02_Fetch_All_Article_Titles", async () => {
        //Capture and store all existing posts (h1) in Array
        const result = await page.evaluate(() => {
            let FeedTitles = document.querySelectorAll(".preview-link > h1");
            const FeedTitlesArray = [...FeedTitles];
            return FeedTitlesArray.map(h => h.innerText);
        });
    console.log("\tTitles of all posts: \r\n" + ("\t-") +result.join("\r\n\t-"));
    await page.screenshot({ path: "src/tests/Screenshots/pass/Conduit_E2E01h_02_Fetch_All_Article_Titles.png" }); //Takes screenshot
    });

    it('Conduit_E2E01h_03_CLICK_Signup_NavBar', async () => {
        const [SignUp] = await page.$x("//a[@class='nav-link'][contains(., 'Sign up')]");

        try {
            await SignUp.click();
            const PageTitle = await page.$eval("h1.text-xs-center", txt => txt.textContent); //Captures title from h1 banner
            assert.strictEqual(PageTitle, "Sign up", "Cannot load sign up page or has recently changed."); //Verifies user has navigated to correct page
            await page.waitForSelector(".btn-primary", {timeout:1000}); //Validates the correct page gets displayed
            await page.screenshot({ path: "src/tests/Screenshots/pass/Conduit_E2E01h_03_SignUp_Form.png" }); //Takes screenshot
        } catch(err) {
            await page.screenshot({ path: "src/tests/Screenshots/fail/FAIL-Conduit_E2E01h_03_CLICK_Signup_NavBar.png" }); //Takes screenshot of landing page
            assert.fail("Cannot find 'Sign Up' button or has recently changed.")
        }
    });

    it('Conduit_E2E01h_04_Enter_Valid_Data_CLICK_SignUp', async () => {
        const [SignUp] = await page.$x("//button[@class='btn btn-lg btn-primary pull-xs-right'][contains(., 'Sign up')]");

        //Enters and submits valid unique data into form
        await page.type('input[placeholder="Username"]', 'Username' + date, {delay: 20})
        await page.type('input[placeholder="Email"]', 'Email' + date + '@email.com', {delay: 20})
        await page.type('input[placeholder="Password"]', 'Password', {delay: 20})
      
        try {
            await SignUp.click();
            await page.waitForSelector(".home-page", {timeout:1000}); //Validates the correct page gets displayed
            const PageTitle = await page.$eval("h1.logo-font", txt => txt.textContent); //Captures title from h1 banner
            assert.strictEqual(PageTitle, "conduit", "Cannot load page after sign up or has recently changed."); //Verifies title is correct
            await page.screenshot({ path: "src/tests/Screenshots/pass/Conduit_E2E01h_04_SignedUpSuccessfully.png" }); //Takes screenshot
        } catch(err) {
            await page.screenshot({ path: "src/tests/Screenshots/fail/FAIL-Conduit_E2E01h_04_SignedUp.png" }); //Takes screenshot of landing page
            assert.fail("Cannot find 'Sign Up' button or page has recently changed.")
        }
    });

    it('Conduit_E2E01h_05_CLICK_NewArticle_NavBar', async () => {
        const [NewArticle] = await page.$x("//a[@class='nav-link'][contains(., 'New Article')]");
        
        try {
            await NewArticle.click();
            await page.waitForSelector(".form-group", {timeout:1000}); //Validates the correct page gets displayed
            await page.screenshot({ path: "src/tests/Screenshots/pass/Conduit_E2E01h_05_NewArticle.png" }); //Takes screenshot
        } catch(err) {
            await page.screenshot({ path: "src/tests/Screenshots/fail/FAIL-Conduit_E2E01h_05_NewArticle.png" });
            assert.fail("Cannot find 'New Article' button or page has recently changed.")
        }       
      });

    it('Conduit_E2E01h_06_Enter_ValidData_POSTArticle', async () => {
        const [PublishArticle] = await page.$x("//button[@class='btn btn-lg btn-primary pull-xs-right'][contains(., 'Publish Article')]");
        
        //Enters data into form
        await page.type('input[placeholder="Article Title"]', 'Title of My Article', {delay: 20})
        await page.type('input[placeholder="What\'s this article about?"]', 'We should really hire this guy!', {delay: 20})
        await page.type('textarea[placeholder="Write your article (in markdown)"]', '# Hello World!', {delay: 20})
        await page.type('input[placeholder="Enter Tags"]', 'AwesomeWork', {delay: 20})
    
        try {
            await PublishArticle.click();
            await page.waitForSelector(".form-group", {timeout:1000}); //Validates the correct page gets displayed
            await page.waitForSelector(('input[disabled]') !== null, {timeout:1000});
            console.log("Passed the disabled element");
        } catch(err) {
            await page.screenshot({ path: "src/tests/Screenshots/fail/FAIL-Conduit_E2E01h_06_PostArticle.png" });
            assert.fail("Cannot post new article or page has recently changed.")
        }        
    });

    it('Conduit_E2E01h_07_CLICK_Home_NavBar', async () => {
    const [Home] = await page.$x("//a[@class='nav-link'][contains(., 'Home')]");

<<<<<<< HEAD
    try {
        await Home.click();
        const PageTitle = await page.$eval("h1.logo-font", txt => txt.textContent); //Captures title from h1 banner
        assert.strictEqual(PageTitle, "conduit", "Cannot load page home page or has recently changed."); //Verifies title is correct
        await page.screenshot({ path: "src/tests/Screenshots/pass/Conduit_E2E01h_07_CLICK_Home_NavBar.png" });
    } catch(err) {
        await page.screenshot({ path: "src/tests/Screenshots/fail/FAIL-Conduit_E2E01h_07_CLICK_Home_NavBar.png" });
        assert.fail("Cannot load page home page or has recently changed.")
    }      
    });
=======
        try {
            await Home.click();
            //Validates the correct page gets displayed and takes screenshot
            await page.waitForSelector(".btn-primary");
            await page.screenshot({ path: "src/tests/Screenshots/pass/Conduit_E2E01h_07_CLICK_Home_NavBar.png" });
        } catch(err) {
            console.log("FAILED: Cannot Navigate to Home Page")
            await page.screenshot({ path: "src/tests/Screenshots/fail/FAIL-Conduit_E2E01h_07_CLICK_Home_NavBar.png" });
            assert.fail(err);
            return;
        }      
      });
>>>>>>> c43ed79d87d64bd52279adb518ef4f0d09bcfd40

      it('Conduit_E2E01h_08_CLICK_GlobalFeed_Tab', async () => {
        const [GlobalFeed] = await page.$x("//a[@class='nav-link'][contains(., 'Global Feed')]");

        try {
            await GlobalFeed.click();
            //Validates the correct page gets displayed and takes screenshot
            assert.strictEqual(PageTitle, "conduit", "Cannot load `Global Feed` or has recently changed."); //Verifies title is correct
            await page.screenshot({ path: "src/tests/Screenshots/pass/Conduit_E2E01h_08_CLICK_GlobalFeed_Tab.png" });
        } catch(err) {
            await page.screenshot({ path: "src/tests/Screenshots/fail/FAIL-Conduit_E2E01h_08_CLICK_GlobalFeed_Tab.png" });
<<<<<<< HEAD
            assert.fail("Cannot load `Global Feed` or has recently changed.")
=======
            assert.fail(err);
            return;
>>>>>>> c43ed79d87d64bd52279adb518ef4f0d09bcfd40
        }   
      });

      it('Conduit_E2E01h_09_Fetch_All_Article_Titles_2', async () => {
        //Capture and store all existing posts (h1) in Array
        const result = await page.evaluate(() => {
            let FeedTitles = document.querySelectorAll(".preview-link > h1");
            const FeedTitlesArray = [...FeedTitles];
            return FeedTitlesArray.map(h => h.innerText);
        });
        console.log("\tTitles of all posts: \r\n" + ("\t-") +result.join("\r\n\t-"));
        await page.screenshot({ path: "src/tests/Screenshots/pass/Conduit_E2E01h_02_Fetch_All_Article_Titles.png" }); //Takes screenshot
    })

    after(async () => {
        await browser.close()
      })
});