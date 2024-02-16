import { test } from '@playwright/test';
import { faker } from '@faker-js/faker/locale/en';
import { CurrentTemperature } from '../pages/currentTemperature.page';
import { SunscreenTypes } from '../enums/sunscreenTypes';
import { MoisturizersContents } from '../enums/moisturizersContents';
import { Skincare } from '../enums/skincare';

let currentTemperaturePage: CurrentTemperature;
let currentMonth: number;

test.beforeEach(async ({ page }) => {
  currentMonth = new Date().getMonth();

  currentTemperaturePage = new CurrentTemperature(page)
  await currentTemperaturePage.open();
});

/** 
 * Shop for moisturizers if the weather is below 19 degrees. 
 * Shop for suncreens if the weather is above 34 degrees.
 */

const testCases: [Skincare
  , SunscreenTypes | MoisturizersContents
  , SunscreenTypes | MoisturizersContents][] = [

    /**
     * Add two sunscreens to your cart. 
     * First, select the least expensive sunscreen that is SPF-50. 
     * For your second sunscreen, select the least expensive sunscreen 
     * that is SPF-30. Click on the cart when you are done.
     */

    [Skincare.SUNSCREENS, SunscreenTypes.SPF_30, SunscreenTypes.SPF_50],

    /**
     * Add two moisturizers to your cart. 
     * First, select the least expensive mositurizer that contains Aloe. 
     * For your second moisturizer, select the least expensive moisturizer 
     * that contains almond. Click on cart when you are done.
     */

    [Skincare.MOISTURIZERS, MoisturizersContents.ALOE, MoisturizersContents.ALMOND],
  ];

for (const [skincare, firstProduct, secondProduct] of testCases) {
  test(`Add ${skincare} to card and verify successful payment`, async () => {

    const skincareShopPage = await currentTemperaturePage.selectSkincareProduct(skincare);

    await skincareShopPage.selectLeastExpensiveProductIndex(firstProduct);
    await skincareShopPage.selectLeastExpensiveProductIndex(secondProduct);

    const expectedListOfProducts = skincareShopPage.selectedProducts;
    const checkoutPage = await skincareShopPage.clickCartButton();

    const actualListOfProducts = await checkoutPage.getProductsFromCart();

    /**
    * Verify that the shopping cart looks correct. 
    * Then, fill out your payment details and submit the form. 
    * You can Google for 'Stripe test card numbers' to use valid cards. 
    * Note: The payment screen will error 5% of the time by design
    */

    await checkoutPage.assertProductsInCartAreTheSameAsSelected(
      expectedListOfProducts,
      actualListOfProducts)

    const stripeFrame = await checkoutPage.clickPayWithCard();

    await stripeFrame.enterCardData(
      // random email with pre-defined domain
      faker.internet.email({ provider: `beyonnex.io` }), 
      // hardcoded 16-digit card number examples from https://docs.stripe.com/testing 
      // to demonstrate ability of using custom faker values
      faker.helpers.arrayElement(
        [5200828282828210, 4242424242424242, 6200000000000005, 3566002020360505]),
      // random month with 0 at begining if month from Januar to September as must be 2-digit
      faker.number.int({ min: currentMonth + 1, max: 12 }).toString().padStart(2, `0`) +
      // random future year comparing to current sliced to last two digits
      faker.date.future().getFullYear().toString().slice(-2),
      // random CVC 3-digit code 
      faker.number.int({ min: 100, max: 999 }));

    const confirmationPage = await stripeFrame.clickPay();

    const paymentState = await confirmationPage.isSuccessfulPayment()

    await confirmationPage.assertPaymentIsSuccesfull(paymentState);

  });
}