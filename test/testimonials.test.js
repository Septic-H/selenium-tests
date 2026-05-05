const { By, until } = require('selenium-webdriver');
const { expect } = require('chai');
const { createDriver, navigateAndWait } = require('../util');
const conf = require('../conf');

describe('Testimonials Page', function () {
  let driver;

  before(async function () {
    driver = await createDriver();
  });

  after(async function () {
    if (driver) await driver.quit();
  });

  it('TC-020: Testimonials page loads and renders stats section', async function () {
    await navigateAndWait(driver, '/testimonials');
    await driver.wait(until.elementLocated(By.css('h1')), conf.TIMEOUTS.explicit);

    const heroText = await driver.findElement(By.css('h1')).getText();
    expect(heroText.toLowerCase()).to.include('testimonial') || expect(heroText.toLowerCase()).to.include('community');

    const statsSection = await driver.findElement(By.xpath(
      '//*[contains(text(), "10,000+") or contains(text(), "students")]'
    ));
    expect(await statsSection.isDisplayed()).to.be.true;
  });

  it('TC-021: Testimonials page renders multiple testimonial cards', async function () {
    await navigateAndWait(driver, '/testimonials');

    const testimonialCards = await driver.findElements(By.xpath(
      '//*[contains(@class, "Card")]//blockquote | //*[contains(text(), "\"")]'
    ));

    const allCards = await driver.findElements(By.css('[class*="Card"]'));
    expect(allCards.length).to.be.greaterThanOrEqual(4);
  });
});