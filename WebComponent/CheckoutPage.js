const { By } = require('selenium-webdriver');
const { WebDriver } = require('selenium-webdriver');

class CheckoutPage {
    constructor(driver) {
        this.driver = driver;
    }

    async getCheckoutTitle() {
        const titleElement = await this.driver.findElement(By.className('title'));
        return await titleElement.getText();
    }

    async fillCheckoutForm(firstName, lastName, postalCode) {
        await this.driver.findElement(By.id('first-name')).sendKeys(firstName);
        await this.driver.findElement(By.id('last-name')).sendKeys(lastName);
        await this.driver.findElement(By.id('postal-code')).sendKeys(postalCode);
    }

    async submitCheckoutForm() {
        const continueButton = await this.driver.findElement(By.id('continue'));
        await continueButton.click();
    }

    async clickFinishButton() {
        const finishButton = await this.driver.findElement(By.id('finish'));
        await finishButton.click();
    }
}

module.exports = CheckoutPage;
