const { Builder } = require('selenium-webdriver');
const LoginPage = require('../WebComponent/LoginPage');
const DashboardPage = require('../WebComponent/DashboardPage');
const CartPage = require('../WebComponent/CartPage');
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

describe('[add-to-cart] Testcase 3', function () {
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
    it('Add to cart and verify item success add to cart', async function () {
        const dashboardPage = new DashboardPage(driver);
        const cartPage = new CartPage(driver);

        // Menambahkan item pertama ke keranjang
        await dashboardPage.addFirstItemToCart();

        // Memverifikasi bahwa badge keranjang menunjukkan 1 item
        const cartBadgeCount = await dashboardPage.getCartBadgeCount();
        assert.strictEqual(cartBadgeCount, 1, 'Expected cart badge count to be 1 after adding an item.');

        // Navigasi ke halaman keranjang
        await dashboardPage.navigateToCart(); // Sekarang metode ini ada di DashboardPage

        const cartItemCount = await cartPage.getCartItemCount();
        assert.strictEqual(cartItemCount, 1, 'Expected 1 item in the cart.');

        // Screenshot hanya pada halaman CartPage
        const screenshot = await driver.takeScreenshot();
        const sanitizedTitle = 'CartPage_Screenshot';
        const filepath = path.join(
            screenshotDir,
            `${sanitizedTitle}_${Date.now()}.png`
        );
        fs.writeFileSync(filepath, screenshot, 'base64');
        console.log(`Screenshot saved: ${filepath}`);
    });

    // Menjalankan satu kali setelah semua tes selesai
    after(async function () {
        if (driver) {
            await driver.quit();
            driver = null;
        }
    });
});
