const { Builder } = require('selenium-webdriver');
const LoginPage = require('./WebComponent/LoginPage');
const DashboardPage = require('./WebComponent/DashboardPage');
const assert = require('assert');
const { title } = require('process');

describe('Testcase 2', function () {
    this.timeout(40000);
    let driver;

    // Menjalankan satu kali di awal sebelum semua tes
    before(async function () {
        driver = await new Builder().forBrowser('chrome').build();
    });

    // Menjalankan sebelum setiap test
    beforeEach(async function () {
        const loginPage = new LoginPage(driver);
        await loginPage.navigate();
        await loginPage.login('haha', 'hihi');

    });

    // Assertion atau validasi
    it('Erorr message appears for invalid credentials', async function () {
        const loginPage = new LoginPage(driver);
        const errorMessage = await loginPage.getErrorMessage();
        assert.strictEqual(title, 'Products', 'Expected erorr message does not match')
    });

    // Menjalankan satu kali setelah semua tes selesai
    after(async function () {
        if (driver) {
            await driver.quit();
        }
    });
});