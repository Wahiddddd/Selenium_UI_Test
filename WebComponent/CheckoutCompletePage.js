// CheckoutCompletePage.js
const { By } = require('selenium-webdriver');

class CheckoutCompletePage {
    constructor(driver) {
        this.driver = driver;
    }

    // Mendapatkan judul halaman untuk verifikasi
    async getCheckoutCompleteTitle() {
        const titleElement = await this.driver.findElement(By.className('title'));
        return await titleElement.getText();
    }
}

module.exports = CheckoutCompletePage;