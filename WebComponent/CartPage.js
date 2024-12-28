const { By } = require('selenium-webdriver');

class CartPage {
    constructor(driver) {
        this.driver = driver;
        this.cartItems = By.className('cart_item'); // Elemen yang merepresentasikan item dalam keranjang
        this.checkoutButton = By.id('checkout'); // Tombol Checkout
        this.removeButtons = By.className('cart_button'); // Tombol Remove untuk setiap item
    }

    // Navigasi ke halaman keranjang
    async navigateToCart() {
        await this.driver.get('https://www.saucedemo.com/cart.html');
    }

    // Menghitung jumlah item dalam keranjang
    async getCartItemCount() {
        const items = await this.driver.findElements(this.cartItems);
        return items.length; // Mengembalikan jumlah item
    }

    // Menghapus item pertama dalam keranjang
    async removeFirstItem() {
        const removeButtons = await this.driver.findElements(this.removeButtons);
        if (removeButtons.length > 0) {
            await removeButtons[0].click(); // Klik tombol remove pada item pertama
        } else {
            throw new Error('No items to remove in the cart.');
        }
    }

    // Melakukan checkout
    async proceedToCheckout() {
        await this.driver.findElement(this.checkoutButton).click();
    }
}

module.exports = CartPage;
