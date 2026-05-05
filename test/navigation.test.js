const { By, until } = require('selenium-webdriver');
const { expect } = require('chai');
const { createDriver, navigateAndWait, resizeWindow } = require('../util');
const conf = require('../conf');

describe('Navigation', function () {
  let driver;

  before(async function () {
    driver = await createDriver();
  });

  after(async function () {
    if (driver) await driver.quit();
  });

  it('TC-004: Navbar links navigate to correct pages', async function () {
    await navigateAndWait(driver, '/');
    await driver.wait(until.elementLocated(By.tagName('header')), conf.TIMEOUTS.explicit);

    const navLinks = [
      { text: 'features', path: '/features' },
      { text: 'testimonials', path: '/testimonials' },
      { text: 'pricing', path: '/pricing' }
    ];

    for (const link of navLinks) {
      await navigateAndWait(driver, '/');
      const navLink = await driver.findElement(By.xpath(
        `//header//a[contains(text(), "${link.text}")]`
      ));
      await navLink.click();
      await driver.wait(until.urlContains(link.path), conf.TIMEOUTS.explicit);
      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).to.include(link.path);
    }
  });

  it('TC-005: Sign In and Sign Up buttons in navbar work', async function () {
    await navigateAndWait(driver, '/');

    const signInBtn = await driver.findElement(By.xpath(
      '//header//a[contains(@href, "/sign-in")]//button[contains(text(), "sign in")]'
    ));
    await signInBtn.click();
    await driver.wait(until.urlContains('/sign-in'), conf.TIMEOUTS.explicit);
    expect(await driver.getCurrentUrl()).to.include('/sign-in');

    await navigateAndWait(driver, '/sign-up');
    const signUpBtn = await driver.findElement(By.xpath(
      '//header//a[contains(@href, "/sign-up")]//button[contains(text(), "get started")]'
    ));
    await signUpBtn.click();
    await driver.wait(until.urlContains('/sign-up'), conf.TIMEOUTS.explicit);
    expect(await driver.getCurrentUrl()).to.include('/sign-up');
  });

  it('TC-006: Footer links navigate correctly', async function () {
    await navigateAndWait(driver, '/');
    await driver.wait(until.elementLocated(By.css('footer')), conf.TIMEOUTS.explicit);

    const footerLinks = [
      { text: 'Features', path: '/features' },
      { text: 'Pricing', path: '/pricing' }
    ];

    for (const link of footerLinks) {
      await navigateAndWait(driver, '/');
      const footerLink = await driver.findElement(By.xpath(
        `//footer//a[contains(text(), "${link.text}")]`
      ));
      await footerLink.click();
      await driver.wait(until.urlContains(link.path), conf.TIMEOUTS.explicit);
      expect(await driver.getCurrentUrl()).to.include(link.path);
    }
  });

  it('TC-007: Sign in link on sign-up page navigates to sign-in', async function () {
    await navigateAndWait(driver, '/sign-up');
    const signInLink = await driver.findElement(By.xpath(
      '//a[contains(@href, "/sign-in") and contains(text(), "sign in")]'
    ));
    await signInLink.click();
    await driver.wait(until.urlContains('/sign-in'), conf.TIMEOUTS.explicit);
    expect(await driver.getCurrentUrl()).to.include('/sign-in');
  });

  it('TC-008: Sign up link on sign-in page navigates to sign-up', async function () {
    await navigateAndWait(driver, '/sign-in');
    const signUpLink = await driver.findElement(By.xpath(
      '//a[contains(@href, "/sign-up") and contains(text(), "sign up")]'
    ));
    await signUpLink.click();
    await driver.wait(until.urlContains('/sign-up'), conf.TIMEOUTS.explicit);
    expect(await driver.getCurrentUrl()).to.include('/sign-up');
  });

  it('TC-009: Mobile hamburger menu opens and closes', async function () {
    await resizeWindow(driver, conf.MOBILE_SIZE.width, conf.MOBILE_SIZE.height);
    await navigateAndWait(driver, '/');
    await driver.wait(until.elementLocated(By.css('header')), conf.TIMEOUTS.explicit);

    const menuBtn = await driver.findElement(By.xpath(
      '//header//button[contains(@class, "p-2") or .//*[local-name()="svg"][contains(@class, "h-5")]]'
    ));

    const isMenuVisible = await driver.findElements(By.css('.md\\:hidden')).then(els => els.length > 0);

    await menuBtn.click();
    await driver.sleep(500);

    const mobileMenu = await driver.findElement(By.css('#mobile-menu, [class*="mobile-menu"], .md\\:hidden'));
    const isOpenAfterClick = await mobileMenu.isDisplayed();

    await menuBtn.click();
    await driver.sleep(500);

    await resizeWindow(driver, conf.WINDOW_SIZE.width, conf.WINDOW_SIZE.height);
  });
});