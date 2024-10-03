/*
    A function that uses puppeteer functions to interact with the page loaded within WebView.
 */
const performSampleTest = async (page) => {
    await page.goto("https://www.healthcare.gov");
    await page.waitForSelector("xpath/" + "//a[contains(text(),'Log in')]", {
        timeout: 5000,
    });
    await page.click("xpath/" + "//a[contains(text(),'Log in')]");
    await page.waitForSelector("xpath/" + '//*[@id="text-field--9"]', {
        timeout: 5000,
    });
    await page.type("xpath/" + '//*[@id="text-field--9"]', "test@yopmail.com");

    await page.waitForSelector("xpath/" + '//*[@id="password-field-id"]', {
        timeout: 5000,
    });
    await page.type("xpath/" + '//*[@id="password-field-id"]', "test");

}

module.exports.performSampleTest = performSampleTest;