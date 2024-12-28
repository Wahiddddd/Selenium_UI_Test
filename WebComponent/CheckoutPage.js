const { By } = require('selenium-webdriver'); // Impor By
const { WebDriver } = require('selenium-webdriver'); // Jika perlu

class CheckoutPage {
    constructor(driver) {
        this.driver = driver;
    }

    // Get the current page title (useful for assertions)
    async getCheckoutTitle() {
        const titleElement = await this.driver.findElement(By.className('title'));
        return await titleElement.getText();
    }

    // Fill out the checkout form
    async fillCheckoutForm(firstName, lastName, postalCode) {
        await this.driver.findElement(By.id('first-name')).sendKeys(firstName);
        await this.driver.findElement(By.id('last-name')).sendKeys(lastName);
        await this.driver.findElement(By.id('postal-code')).sendKeys(postalCode);
    }

    // Submit the checkout form
    async submitCheckoutForm() {
        const continueButton = await this.driver.findElement(By.id('continue'));
        await continueButton.click();
    }

    // Click the Finish button to complete the checkout
    async clickFinishButton() {
        const finishButton = await this.driver.findElement(By.id('finish'));
        await finishButton.click();
    }
}

module.exports = CheckoutPage;
