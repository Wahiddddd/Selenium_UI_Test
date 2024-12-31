const { Builder } = require('selenium-webdriver');
const LoginPage = require('../WebComponent/LoginPage');
const DashboardPage = require('../WebComponent/DashboardPage');
const assert = require('assert');
const dotenv = require('dotenv');  // Import dotenv untuk memuat variabel dari .env file
const fs = require('fs');
const path = require('path');

// Memuat variabel lingkungan dari file .env
dotenv.config();

// Mengambil nilai dari file .env
const browser = process.env.BROWSER || 'chrome';
const baseUrl = process.env.BASE_URL;
const username = process.env.USER_NAME;
const password = process.env.PASSWORD;

// Direktori untuk menyimpan screenshot
const screenshotDir = './screenshots/';
if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
}

describe('[login] Testcase 2', function () {
    this.timeout(40000);
    let driver;
    let options;

    // Menentukan opsi untuk masing-masing browser
    before(async function () {
        switch (browser.toLowerCase()) {
            case 'firefox': {
                const firefox = require('selenium-webdriver/firefox');
                options = new firefox.Options();
                options.addArguments('--headless');  // Menjalankan Firefox di mode headless
                driver = await new Builder().forBrowser('firefox').setFirefoxOptions(options).build();
                break;
            }
            case 'edge': {
                const edge = require('selenium-webdriver/edge');
                options = new edge.Options();
                options.addArguments('--headless');  // Menjalankan Edge di mode headless
                driver = await new Builder().forBrowser('edge').setEdgeOptions(options).build();
                break;
            }
            case 'chrome':
            default: {
                const chrome = require('selenium-webdriver/chrome');
                options = new chrome.Options();
                options.addArguments('--headless');  // Menjalankan Chrome di mode headless
                driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
                break;
            }
        }
    });

    // Menjalankan sebelum setiap test
    beforeEach(async function () {
        const loginPage = new LoginPage(driver);
        await loginPage.navigate(baseUrl);  // Gunakan baseUrl dari .env
        await loginPage.login(username, password);  // Gunakan username dan password dari .env
    });

    // Assertion atau validasi
    it('Error message appears for invalid credentials', async function () {
        const loginPage = new LoginPage(driver);
        const errorMessage = await loginPage.getErrorMessage();

        // Periksa apakah error message yang diharapkan muncul
        assert.strictEqual(errorMessage, 'Epic sadface: Username and password do not match any user in this service', 'Expected error message does not match');
        
        // Ambil screenshot jika terjadi kesalahan
        try {
            const screenshot = await driver.takeScreenshot();
            const sanitizedTitle = 'ErrorMessage_' + Date.now();
            const filepath = path.join(screenshotDir, `${sanitizedTitle}.png`);
            fs.writeFileSync(filepath, screenshot, 'base64');
            console.log(`Screenshot saved: ${filepath}`);
        } catch (err) {
            console.error('Failed to take screenshot:', err);
        }
    });

    // Menjalankan satu kali setelah semua tes selesai
    after(async function () {
        if (driver) {
            await driver.quit();
        }
    });
});
