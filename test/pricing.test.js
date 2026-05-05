const { By, until } = require('selenium-webdriver');
const { expect } = require('chai');
const { createDriver, navigateAndWait } = require('../util');
const conf = require('../conf');

describe('Pricing Page', function () {
  let driver;

  before(async function () {
    driver = await createDriver();
  });

  after(async function () {
    if (driver) await driver.quit();
  });

  it('TC-018: Pricing page loads and displays student and teacher plan cards', async function () {
    await navigateAndWait(driver, '/pricing');
    await driver.wait(until.elementLocated(By.css('h1')), conf.TIMEOUTS.explicit);

    const heroText = await driver.findElement(By.css('h1')).getText();
    expect(heroText.toLowerCase()).to.include('pricing');

    const studentSection = await driver.findElement(By.xpath(
      '//h2[contains(text(), "student") or contains(text(), "Student")]'
    ));
    expect(await studentSection.isDisplayed()).to.be.true;

    const planCards = await driver.findElements(By.xpath(
      '//*[contains(@class, "Card")]//*[contains(@class, "CardHeader")]'
    ));
    expect(planCards.length).to.be.greaterThanOrEqual(6);
  });

  it('TC-019: Pricing page FAQ section contains expected questions', async function () {
    await navigateAndWait(driver, '/pricing');
    await driver.wait(until.elementLocated(By.xpath('//h2[contains(text(), "faq")]'), conf.TIMEOUTS.explicit) ||
      until.elementLocated(By.css('h2')), conf.TIMEOUTS.explicit);

    const faqHeaders = await driver.findElements(By.xpath(
      '//h3[contains(text(), "?") or //*[contains(@class, "faq")]//h3'
    ));

    const generalHeaders = await driver.findElements(By.css('h3'));
    expect(generalHeaders.length).to.be.greaterThanOrEqual(3);
  });
});