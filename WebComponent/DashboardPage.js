const { By, until } = require('selenium-webdriver');

class DashboardPage {
    constructor(driver) {
        this.driver = driver;
    }

    // Menavigasi ke halaman Dashboard
    async navigate() {
        await this.driver.get('https://www.saucedemo.com/');
    }

    // Melakukan login ke halaman
    async login(username, password) {
        await this.driver.findElement(By.id('user-name')).sendKeys(username);
        await this.driver.findElement(By.id('password')).sendKeys(password);
        await this.driver.findElement(By.id('login-button')).click();
    }

    // Memeriksa apakah kita berada di halaman dashboard
    async isOnDashboard() {
        const title = await this.driver.getTitle();
        return title;
    }

    // Menambahkan item pertama ke keranjang
    async addFirstItemToCart() {
        await this.driver.findElement(By.css('.inventory_item:nth-child(1) .btn_inventory')).click();
    }

    // Mendapatkan jumlah badge cart
    async getCartBadgeCount() {
        const badge = await this.driver.findElement(By.css('.shopping_cart_badge'));
        const badgeText = await badge.getText();
        return parseInt(badgeText, 10);
    }

    // Menavigasi ke halaman Cart
    async navigateToCart() {
        // Klik ikon cart untuk pergi ke halaman cart
        const cartIcon = await this.driver.findElement(By.css('.shopping_cart_link'));
        await cartIcon.click();
    }
}

module.exports = DashboardPage;
