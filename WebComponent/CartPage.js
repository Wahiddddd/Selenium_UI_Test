// CartPage.js

const { By } = require('selenium-webdriver');

class CartPage {
    constructor(driver) {
        this.driver = driver;
    }

    // Mendapatkan jumlah item dalam keranjang
    async getCartItemCount() {
        const items = await this.driver.findElements(By.css('.cart_item'));
        return items.length;
    }

    // Menavigasi ke halaman Checkout
    async navigateToCheckout() {
        const checkoutButton = await this.driver.findElement(By.id('checkout'));
        await checkoutButton.click();
    }
}

module.exports = CartPage;