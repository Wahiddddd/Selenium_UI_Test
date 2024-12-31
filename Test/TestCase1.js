const { Builder } = require('selenium-webdriver');
const LoginPage = require('../WebComponent/LoginPage');
const DashboardPage = require('../WebComponent/DashboardPage');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const browser = process.env.BROWSER;
const baseUrl = process.env.BASE_URL;
const username = process.env.USER_NAME;
const password = process.env.PASSWORD;

const screenshotDir = './screenshots/';

// Membuat direktori screenshot jika belum ada
if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
}

describe('Testcase 1 [login] #Regression #Smoke', function () {
    this.timeout(40000);
    let driver;
    let options;

    switch (browser.toLowerCase()) {
        case 'firefox': {
            const firefox = require('selenium-webdriver/firefox');
            options = new firefox.Options();
            options.addArguments('--headless');
            break;
        }
        case 'edge': {
            const edge = require('selenium-webdriver/edge');
            options = new edge.Options();
            options.addArguments('--headless');
            break;
        }
        case 'chrome':
        default: {
            const chrome = require('selenium-webdriver/chrome');
            options = new chrome.Options();
            options.addArguments('--headless');
            break;
        }
    }

    // Menjalankan satu kali di awal sebelum semua tes
    before(async function () {
        try {
            driver = await new Builder().forBrowser(browser).setChromeOptions(options).build();
        } catch (error) {
            console.error(`Failed to initialize WebDriver: ${error.message}`);
            throw error;
        }
    });

    // Menjalankan sebelum setiap tes
    beforeEach(async function () {
        const loginPage = new LoginPage(driver);
        await loginPage.navigate(baseUrl);
        await loginPage.login(username, password);
    });

    // Assertion atau validasi
    it('Login successfully and verify dashboard', async function () {
        const dashboardPage = new DashboardPage(driver);
        const title = await dashboardPage.isOnDashboard();

        // Log nilai title untuk debugging
        console.log('Dashboard Title:', title);

        // Periksa apakah 'Swag Labs' ada dalam judul halaman
        assert(title.includes('Swag Labs'), 'Expected dashboard title to contain "Swag Labs"');
    });

    // Menyimpan screenshot setelah setiap tes
    afterEach(async function () {
        if (driver) {
            try {
                const screenshot = await driver.takeScreenshot();
                const sanitizedTitle = this.currentTest.title.replace(/[^a-zA-Z0-9_\-]/g, '_');
                const filepath = path.join(
                    screenshotDir,
                    `${sanitizedTitle}_${Date.now()}.png`
                );
                fs.writeFileSync(filepath, screenshot, 'base64');
                console.log(`Screenshot saved: ${filepath}`);
            } catch (err) {
                console.error(`Failed to take screenshot: ${err.message}`);
            }
        }
    });

    // Menjalankan satu kali setelah semua tes selesai
    after(async function () {
        if (driver) {
            await driver.quit();
            driver = null;
        }
    });
});
