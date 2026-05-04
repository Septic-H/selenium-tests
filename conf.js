module.exports = {
  BASE_URL: process.env.APP_URL || 'http://localhost:8081',

  TIMEOUTS: {
    implicit: 5000,
    explicit: 10000,
    script: 30000
  },

  CHROME_OPTIONS: [
    '--headless',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--window-size=1920,1080'
  ],

  WINDOW_SIZE: {
    width: 1920,
    height: 1080
  },

  MOBILE_SIZE: {
    width: 375,
    height: 667
  }
}