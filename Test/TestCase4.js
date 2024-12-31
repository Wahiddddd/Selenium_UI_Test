const { Builder } = require('selenium-webdriver');
const LoginPage = require('../WebComponent/LoginPage');
const DashboardPage = require('../WebComponent/DashboardPage');
const CartPage = require('../WebComponent/CartPage');
const CheckoutPage = require('../WebComponent/CheckoutPage');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');  // Import dotenv untuk memuat variabel dari .env file

// Memuat variabel lingkungan dari file .env
dotenv.config();

// Mengambil nilai dari file .env
const browser = process.env.BROWSER || 'chrome'; // Default ke 'chrome' jika BROWSER tidak ditemukan di .env
const baseUrl = process.env.BASE_URL;
const username = process.env.USER_NAME;
const password = process.env.PASSWORD;

const screenshotDir = './screenshots/';

// Membuat direktori screenshot jika belum ada
if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
}

describe('[checkout] Testcase 4', function () {
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
    it('Add to cart, complete checkout, and verify completion', async function () {
        const dashboardPage = new DashboardPage(driver);
        const cartPage = new CartPage(driver);
        const checkoutPage = new CheckoutPage(driver);
    
        // tambahkan item pertama ke cart
        await dashboardPage.addFirstItemToCart();
    
        // Navigasi ke cart
        await dashboardPage.navigateToCart();
    
        // pergi ke halaman checkout
        await cartPage.navigateToCheckout();
    
        // mengisi checkout form
        await checkoutPage.fillCheckoutForm('Wahid', 'Doe', '12345');
        await checkoutPage.submitCheckoutForm();
    
        // Verifikasi jika berada pada halaman overview
        const overviewTitle = await checkoutPage.getCheckoutTitle();
        assert.strictEqual(overviewTitle, 'Checkout: Overview', 'Expected to be on Checkout: Overview page');
    
        // Click Finish to menyelesaikan checkout
        await checkoutPage.clickFinishButton();
    
        // Verifikasi jika sudah berada pada complete page
        const completeTitle = await checkoutPage.getCheckoutTitle();
        assert.strictEqual(completeTitle, 'Checkout: Complete!', 'Expected to be on Checkout: Complete! page');
        
        // Screenshot setelah complete page selesai
        try {
            const screenshot = await driver.takeScreenshot();
            const sanitizedTitle = 'CheckoutComplete_' + Date.now();
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
            driver = null;
        }
    });
});
