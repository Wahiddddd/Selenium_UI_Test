const { By } = require('selenium-webdriver');

class DashboardPage {
    constructor(driver) {
        this.driver = driver;
        this.firstAddToCartButton = By.xpath("(//button[text()='Add to cart'])[1]"); // Tombol Add to Cart pertama
        this.cartBadge = By.className('shopping_cart_badge'); // Ikon jumlah item di keranjang
    }

    async isOnDashboard() {
        const title = await this.driver.getTitle();
        return title;
    }

    async addFirstItemToCart() {
        const addToCartButton = await this.driver.findElement(this.firstAddToCartButton);
        await addToCartButton.click(); // Klik tombol Add to Cart
    }

    async getCartBadgeCount() {
        try {
            const badge = await this.driver.findElement(this.cartBadge);
            const badgeText = await badge.getText();
            return parseInt(badgeText, 10); // Konversi teks menjadi angka
        } catch (err) {
            return 0; // Jika tidak ada badge, jumlah item adalah 0
        }
    }
}

module.exports = DashboardPage;
