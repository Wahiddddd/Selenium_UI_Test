const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');

async function SauceDemoAddToCart() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get("https://www.saucedemo.com");

        // Masukkan username dan password
        await driver.findElement(By.id('user-name')).sendKeys('standard_user');
        await driver.findElement(By.xpath("//input[@id='password']")).sendKeys('secret_sauce');

        // Klik tombol login
        await driver.findElement(By.xpath("//input[@id='login-button']")).click();

        // Memastikan berada pada home page dengan mencari "Swag Labs"
        let titleText = await driver.findElement(By.xpath("//div[@class='app_logo']")).getText();
        assert.strictEqual(titleText.includes('Swag Labs'), true, "Title does not include 'Swag Labs'");

        // Memastikan berada pada home page dengan mencari "ikon burger"
        let menuButton = await driver.findElement(By.xpath("//button[@id='react-burger-menu-btn']"));
        assert.strictEqual(await menuButton.isDisplayed(), true, "Menu button is not visible");

        // Pilih produk "Sauce Labs Backpack" dan tambahkan ke cart
        const productName = "Sauce Labs Backpack";
        const productXPath = `//div[text()='${productName}']/ancestor::div[@class='inventory_item']//button[contains(@id,'add-to-cart')]`;

        // Klik tombol "Add to Cart" untuk produk yang dipilih
        await driver.findElement(By.xpath(productXPath)).click();

        // Memastikan ikon cart menunjukkan angka
        let ikonCart = await driver.findElement(By.xpath("//span[@class='shopping_cart_badge']"));
        assert.strictEqual(await ikonCart.isDisplayed(), true, "Product failed to add to cart");

        // Klik ikon cart
        await driver.findElement(By.xpath("//div[@id='shopping_cart_container']/a[1]")).click();

        // Verifikasi bahwa produk yang ditambahkan ada di halaman cart
        const cartItemXPath = `//div[@class='inventory_item_name' and text()='${productName}']`;
        let cartItemName = await driver.findElement(By.xpath(cartItemXPath)).getText();
        assert.strictEqual(cartItemName, productName, `Product '${productName}' is not found in the cart`);

        console.log("Test passed: The correct product was added to the cart and verified successfully.");
    } finally {
        await driver.quit();
    }
}

SauceDemoAddToCart();
