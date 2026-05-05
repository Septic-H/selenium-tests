const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const conf = require('./conf');

async function createDriver() {
  const options = new chrome.Options();
  conf.CHROME_OPTIONS.forEach(opt => options.addArguments(opt));

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  await driver.manage().setTimeouts({
    implicit: conf.TIMEOUTS.implicit,
    pageLoad: conf.TIMEOUTS.explicit,
    script: conf.TIMEOUTS.script,
  });

  return driver;
}

async function navigateAndWait(driver, path) {
  await driver.get(conf.BASE_URL + path);
}

async function clickAndWaitForNavigation(driver, element) {
  const url = await driver.getCurrentUrl();
  await element.click();
  await driver.wait(async () => {
    const currentUrl = await driver.getCurrentUrl();
    return currentUrl !== url;
  }, conf.TIMEOUTS.explicit);
}

async function assertElementPresent(driver, by, description) {
  const elements = await driver.findElements(by);
  if (elements.length === 0) {
    throw new Error(`Expected element to be present: ${description}`);
  }
}

async function assertElementText(driver, by, expectedText, description) {
  const element = await driver.findElement(by);
  const actualText = await element.getText();
  if (!actualText.includes(expectedText)) {
    throw new Error(`Expected text "${expectedText}" in ${description}, got "${actualText}"`);
  }
}

async function waitForElement(driver, by, timeout = conf.TIMEOUTS.explicit) {
  await driver.wait(
    () => driver.findElements(by).then(els => els.length > 0),
    timeout
  );
}

async function resizeWindow(driver, width, height) {
  await driver.manage().window().setSize(width, height);
}

module.exports = {
  createDriver,
  navigateAndWait,
  clickAndWaitForNavigation,
  assertElementPresent,
  assertElementText,
  waitForElement,
  resizeWindow,
};