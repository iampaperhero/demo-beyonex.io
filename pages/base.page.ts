import { Page, expect } from "@playwright/test";
import { Product } from "../interfaces/product.interface";
import { ProductHelper } from "../utils/product.helper";

export class BasePage {

    constructor(public base: Page) {}

    protected async waitForPageLoad() {
        await this.base.waitForLoadState(`domcontentloaded`);
        await this.base.waitForLoadState(`networkidle`);
    }

    async open() {
        
        /**
         * alternativelly can be used process.env.BASE_URL if tests 
         * will be executed not only against weathershopper url
         */
        
        await this.base.goto("https://weathershopper.pythonanywhere.com/");
    }

    async assertProductsInCartAreTheSameAsSelected(
        initiallySelected: Product[],
        productsInCart: Product[]) {
        const expectedListOfProducts = ProductHelper.removeIndexesFromProducts(initiallySelected);
        const actualListOfProducts = ProductHelper.removeIndexesFromProducts(productsInCart);
        expect(actualListOfProducts, `Products in card are not the same to selected before`)
        .toEqual(expectedListOfProducts);
    }

    async assertPaymentIsSuccesfull(paymentState: boolean){
        expect(paymentState, `Payment is not successfull`).toBeTruthy();
    }

}