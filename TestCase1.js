const { Builder } = require('selenium-webdriver');
const LoginPage = require('./WebComponent/LoginPage');
const DashboardPage = require('./WebComponent/DashboardPage');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const screenshotDir = './screenshots/';

// Membuat direktori screenshot jika belum ada
if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
}

describe('Testcase 1', function () {
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
        await loginPage.login('standard_user', 'secret_sauce');
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