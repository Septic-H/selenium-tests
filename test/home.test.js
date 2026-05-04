const { By, until } = require('selenium-webdriver');
const { expect } = require('chai');
const { createDriver, navigateAndWait, assertElementPresent, waitForElement } = require('../util');
const conf = require('../conf');

describe('Home Page', function() {
  let driver;

  before(async function() {
    driver = createDriver();
  });

  after(async function() {
    if (driver) await driver.quit();
  });

  it('TC-001: Home page title and hero content renders correctly', async function() {
    await navigateAndWait(driver, '/');
    await driver.wait(until.titleContains('schedewl'), conf.TIMEOUTS.explicit);

    const heroTitle = await driver.findElement(By.css('h1'));
    const heroText = await heroTitle.getText();
    expect(heroText.toLowerCase()).to.include('schedewl');

    const tagline = await driver.findElement(By.css('h2'));
    const taglineText = await tagline.getText();
    expect(taglineText.length).to.be.greaterThan(0);

    const stats = await driver.findElements(By.css('.grid-cols-3 > div'));
    expect(stats.length).to.be.greaterThanOrEqual(3);
  });

  it('TC-002: Home page "Get Started" CTA navigates to /sign-up', async function() {
    await navigateAndWait(driver, '/');

    const getStartedBtn = await driver.findElement(By.xpath(
      '//a[contains(@href, "/sign-up")]//button[contains(text(), "get started")]'
    ));
    await getStartedBtn.click();
    await driver.wait(until.urlContains('/sign-up'), conf.TIMEOUTS.explicit);

    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('/sign-up');
  });

  it('TC-003: Home page "Learn More" CTA navigates to /features', async function() {
    await navigateAndWait(driver, '/');

    const learnMoreBtn = await driver.findElement(By.xpath(
      '//a[contains(@href, "/features")]//button[contains(text(), "learn more")]'
    ));
    await learnMoreBtn.click();
    await driver.wait(until.urlContains('/features'), conf.TIMEOUTS.explicit);

    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('/features');
  });
});