const { By, until } = require('selenium-webdriver');
const { expect } = require('chai');
const { createDriver, navigateAndWait } = require('../util');
const conf = require('../conf');

describe('Authentication Pages', function () {
  let driver;

  before(async function () {
    driver = await createDriver();
  });

  after(async function () {
    if (driver) await driver.quit();
  });

  it('TC-010: Sign-in page renders all form fields correctly', async function () {
    await navigateAndWait(driver, '/sign-in');
    await driver.wait(until.elementLocated(By.id('email')), conf.TIMEOUTS.explicit);

    const emailInput = await driver.findElement(By.id('email'));
    const passwordInput = await driver.findElement(By.id('password'));
    const submitBtn = await driver.findElement(By.xpath('//button[@type="submit"]'));

    expect(await emailInput.isDisplayed()).to.be.true;
    expect(await passwordInput.isDisplayed()).to.be.true;
    expect(await submitBtn.isDisplayed()).to.be.true;
    expect(await submitBtn.getText()).to.include('sign in');
  });

  it('TC-011: Sign-in with invalid credentials shows error message', async function () {
    await navigateAndWait(driver, '/sign-in');
    await driver.wait(until.elementLocated(By.id('email')), conf.TIMEOUTS.explicit);

    await driver.findElement(By.id('email')).sendKeys('invalid@test.com');
    await driver.findElement(By.id('password')).sendKeys('wrongpassword');
    await driver.findElement(By.xpath('//button[@type="submit"]')).click();

    await driver.wait(until.elementLocated(By.css('[class*="bg-red-50"], .text-red-600')), conf.TIMEOUTS.explicit);

    const errorElements = await driver.findElements(By.css('[class*="bg-red-50"], .text-red-600, [class*="red"]'));
    let errorFound = false;
    for (const el of errorElements) {
      const text = await el.getText();
      if (text && text.length > 0) {
        errorFound = true;
        break;
      }
    }
    expect(errorFound).to.be.true;
  });

  it('TC-012: Sign-up page renders all form fields correctly', async function () {
    await navigateAndWait(driver, '/sign-up');
    await driver.wait(until.elementLocated(By.id('name')), conf.TIMEOUTS.explicit);

    const nameInput = await driver.findElement(By.id('name'));
    const emailInput = await driver.findElement(By.id('email'));
    const passwordInput = await driver.findElement(By.id('password'));
    const submitBtn = await driver.findElement(By.xpath('//button[@type="submit"]'));

    expect(await nameInput.isDisplayed()).to.be.true;
    expect(await emailInput.isDisplayed()).to.be.true;
    expect(await passwordInput.isDisplayed()).to.be.true;
    expect(await submitBtn.isDisplayed()).to.be.true;
  });

  it('TC-013: Sign-up form validation on empty submission', async function () {
    await navigateAndWait(driver, '/sign-up');

    const submitBtn = await driver.findElement(By.xpath('//button[@type="submit"]'));
    await submitBtn.click();

    const nameInput = await driver.findElement(By.id('name'));
    const validationMessage = await nameInput.getAttribute('validationMessage') ||
      await driver.switchTo().activeElement().getAttribute('validationMessage');

    expect(validationMessage).to.not.be.null;
  });

  it('TC-014: Role selection page renders correctly for authenticated users', async function () {
    await navigateAndWait(driver, '/role-selection');
    await driver.wait(until.elementLocated(By.css('form, [class*="card"]')), conf.TIMEOUTS.explicit);

    const studentBtn = await driver.findElement(By.xpath(
      '//button[contains(@class, "student") or .//*[contains(text(), "student")]]'
    ));
    const teacherBtn = await driver.findElement(By.xpath(
      '//button[contains(@class, "teacher") or .//*[contains(text(), "teacher")]]'
    ));

    expect(await studentBtn.isDisplayed()).to.be.true;
    expect(await teacherBtn.isDisplayed()).to.be.true;
  });

  it('TC-015: Dashboard redirects unauthenticated users to sign-in', async function () {
    await navigateAndWait(driver, '/dashboard');

    await driver.wait(until.urlContains('/sign-in'), conf.TIMEOUTS.explicit * 2);

    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.satisfy(url => url.includes('/sign-in') || url.includes('/role-selection'));
  });
});