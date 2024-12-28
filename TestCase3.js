const { Builder } = require('selenium-webdriver');
const LoginPage = require('./WebComponent/LoginPage');
const DashboardPage = require('./WebComponent/DashboardPage');
const CartPage = require('./WebComponent/CartPage');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const screenshotDir = './screenshots/';

// Membuat direktori screenshot jika belum ada
if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
}

describe('Testcase 3', function () {
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
