URL = 'https://www.nettiauto.com/volkswagen/vaihtoautot?country=73&vehicleType=1'

const puppeteer = require('puppeteer');

(async () => {
    // Launch the browser
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Replace with the URL of the page you want to visit
    await page.goto(URL);

    // Wait for the specific elements containing the information to be present in the DOM
    await page.waitForSelector('.grid-x.cell.list-body.total-upsell-ad');

    // Extract the year, make, and manufacturer from all elements
    const carDetailsArray = await page.evaluate(() => {
        // Select all container elements
        const containerElements = document.querySelectorAll('#listingData .list-card');
        const carDetailsList = [];

        // Iterate over each container element and extract the details
        containerElements.forEach(container => {
            const titleElement = container.querySelector('.list-card__info_details__title');
            const detailsElements = container.querySelectorAll('.list-card__info_details__vinfo li');
            const priceElement = container.querySelector('.list-card__info_price__main');

            // Extract the individual details
            const title = titleElement ? titleElement.textContent.trim() : 'Title not found';
            const year = detailsElements[0] ? detailsElements[0].textContent.trim() : 'Year not found';
            const mileage = detailsElements[1] ? detailsElements[1].textContent.trim() : 'Mileage not found';
            const fuelType = detailsElements[2] ? detailsElements[2].textContent.trim() : 'Fuel type not found';
            const transmission = detailsElements[3] ? detailsElements[3].textContent.trim() : 'Transmission not found';
            const price = priceElement ? priceElement.textContent.trim() : 'Price not found';

            carDetailsList.push({
                title,
                year,
                mileage,
                fuelType,
                transmission,
                price
            });
        });

        return carDetailsList;
    });

    console.log('Car Details:', carDetailsArray);

    // Close the browser
    await browser.close();
})();