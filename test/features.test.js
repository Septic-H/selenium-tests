const { By, until } = require('selenium-webdriver');
const { expect } = require('chai');
const { createDriver, navigateAndWait } = require('../util');
const conf = require('../conf');

describe('Features Page', function() {
  let driver;

  before(async function() {
    driver = createDriver();
  });

  after(async function() {
    if (driver) await driver.quit();
  });

  it('TC-016: Features page loads and renders all 9 feature cards', async function() {
    await navigateAndWait(driver, '/features');
    await driver.wait(until.elementLocated(By.css('h1')), conf.TIMEOUTS.explicit);

    const heroText = await driver.findElement(By.css('h1')).getText();
    expect(heroText.toLowerCase()).to.include('teach') || expect(heroText.toLowerCase()).to.include('learn');

    const cards = await driver.findElements(By.css('[class*="Card"], .shadow-lg'));
    expect(cards.length).to.be.greaterThanOrEqual(9);
  });

  it('TC-017: Features page "Get Started Free" CTA navigates to /sign-up', async function() {
    await navigateAndWait(driver, '/features');

    const ctaBtn = await driver.findElement(By.xpath(
      '//a[contains(@href, "/sign-up")]//button[contains(text(), "get started") or contains(text(), "start")]'
    ));
    await ctaBtn.click();
    await driver.wait(until.urlContains('/sign-up'), conf.TIMEOUTS.explicit);

    expect(await driver.getCurrentUrl()).to.include('/sign-up');
  });
});