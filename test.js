const { Builder, By, Key, until } = require('selenium-webdriver');

async function exampleTest() {
    //membuat koneksi dengan browser driver
    let driver = await new Builder().forBrowser('chrome').build();

    //exception handling & conclusion
    try{
        await driver.get("https:www.google.com");

        //mencari di search box
        let searchBox = await driver.findElement(By.name('q'));

        //simulate user behavior typing "Hello world"
        await searchBox.sendKeys("Hello World!", Key.RETURN);
        await driver.wait(until.elementLocated(By.id('result-stats')), 10000);

        let title = await driver.getTitle();
        console.log('Page Title is: ${title}');
    }finally {
        //close browser
        await driver.quit()
    }
}

exampleTest();
