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

describe('Testcase 4', function () {
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
    it('Add to cart, complete checkout, and verify completion', async function () {
        const dashboardPage = new DashboardPage(driver);
        const cartPage = new CartPage(driver);
        const checkoutPage = new CheckoutPage(driver);
    
        // tambahkan item pertama to cart
        await dashboardPage.addFirstItemToCart();
    
        // Navigasi ke cart
        await dashboardPage.navigateToCart();
    
        // pergi ke halaman checkout
        await cartPage.navigateToCheckout();
    
        // mengisi checkout from
        await checkoutPage.fillCheckoutForm('wahid', 'Doe', '12345');
        await checkoutPage.submitCheckoutForm();
    
        // Verifikasi jika berada pada halaman overview
        const overviewTitle = await checkoutPage.getCheckoutTitle();
        assert.strictEqual(overviewTitle, 'Checkout: Overview', 'Expected to be on Checkout: Overview page');
    
        // Click Finish to menyelesaikan checkout
        await checkoutPage.clickFinishButton();
    
        // verifikasi jika sudah berada pada complete page
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
