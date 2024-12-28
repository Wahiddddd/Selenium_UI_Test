const { Builder } = require('selenium-webdriver');
const LoginPage = require('./WebComponent/LoginPage');
const DashboardPage = require('./WebComponent/DashboardPage');
const CartPage = require('./WebComponent/CartPage');
const CheckoutPage = require('./WebComponent/CheckoutPage');
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
    it('Login successfully and verify dashboard', async function () {
        const dashboardPage = new DashboardPage(driver);
        const title = await dashboardPage.isOnDashboard();
        assert.strictEqual(title, 'Products', 'Expected dashboard title to be "Products"');
    });

    it('Add to cart and verify item success add to cart', async function () {
        const dashboardPage = new DashboardPage(driver);
        const cartPage = new CartPage(driver);

        // Menambahkan item pertama ke keranjang
        await dashboardPage.addFirstItemToCart();
        const cartBadgeCount = await dashboardPage.getCartBadgeCount();
        assert.strictEqual(cartBadgeCount, 1, 'Expected cart badge count to be 1 after adding an item.');

        // Navigasi ke halaman keranjang
        await cartPage.navigateToCart();
        const cartItemCount = await cartPage.getCartItemCount();
        assert.strictEqual(cartItemCount, 1, 'Expected 1 item in the cart.');

        // Navigasi ke halaman checkout
        await cartPage.navigateToCheckout();

        const checkoutPage = new CheckoutPage(driver);
        const checkoutTitle = await checkoutPage.getCheckoutTitle();
        assert.strictEqual(checkoutTitle, 'Checkout: Your Information', 'Expected to be on Checkout Page');

        // Screenshot hanya pada halaman CheckoutPage
        const screenshot = await driver.takeScreenshot();
        const sanitizedTitle = 'CheckoutPage_Screenshot';
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
