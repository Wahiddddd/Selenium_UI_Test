const { By } = require('selenium-webdriver')

class AddToCartPage{
    constructor (driver){
        this.driver = driver;
        this.AddToCartButton = By.xpath("//button[@id='add-to-cart-sauce-labs-backpack']");
        this.CheckoutIconButton = By.xpath("//a[.='1']");
    }

    async navigate(){
        await this.driver.get("https://saucedemo.com/")
    }

    async login (Inventory_Item_Name, password){
        await this.driver.findElement(this.Inventory_Item_Name).sendKeys(Inventory_Item_Name);
        await this.driver.findElement(this.passwordInput).sendKeys(password);
        await this.driver.findElement(this.loginButon).click();

    }

    async errorMessage(){
        try {
            const errorElement = await this.driver.findElement(this.errorMessage);
            return await errorElement.getText();
        } catch (err){
            return null; //tidak ada message
        }
    }


}

module.exports = LoginPage;