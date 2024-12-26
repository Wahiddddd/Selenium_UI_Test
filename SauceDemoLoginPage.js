const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert')

async function SauceDemoLoginTest(){
    let driver = await new Builder().forBrowser('chrome').build();

    try{
        await driver.get("https://www.saucedemo.com")

        //masukan username dan password
        await driver.findElement(By.id('user-name')).sendKeys('standard_user');
        await driver.findElement(By.xpath("//input[@id='password']")).sendKeys('secret_sauce');

        //Click button login
        await driver.findElement(By.xpath("//input[@id='login-button']")).click();

        //Memastikan berada pada home page dengan mencari "Swag Labs"
        let titleText = await driver.findElement(By.xpath("//div[@class='app_logo']")).getText();
        assert.strictEqual(titleText.includes('Swag Labs'), true, "Title does not include 'Swag Labs'");

        //Memastikan berada pada home page dengan mencari "ikon burger"
        let menuButton = await driver.findElement(By.xpath("//button[@id='react-burger-menu-btn']"));
        assert.strictEqual(await menuButton.isDisplayed(), true, "Menu button is not visible")
        

    } finally {
        await driver.quit()
    }
}

SauceDemoLoginTest();