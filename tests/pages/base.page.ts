import { Page, expect } from "@playwright/test";
import { Product } from "../interfaces/product.interface";

export class BasePage {

    constructor(public base: Page) {}

    protected async waitForPageLoad() {
        await this.base.waitForLoadState('domcontentloaded');
        await this.base.waitForLoadState('networkidle');
    }

    async open() {
        
        /**
         * alternativelly can be used process.env.BASE_URL if tests 
         * will be executed not only against weathershopper url
         */
        
        await this.base.goto("https://weathershopper.pythonanywhere.com/");
    }

    private async removeIndexesFromProducts(listOfProducts: Product[]): Promise<Product[]> {
        const productsWithoutIndex:
            Omit<Product, 'index'>[] = listOfProducts.map(({ index, ...rest }) => rest);
        return productsWithoutIndex as Product[];
    }

    async assertProductsInCartAreTheSameAsSelected(
        initiallySelected: Product[],
        productsInCart: Product[]) {
        const expectedListOfProducts = this.removeIndexesFromProducts(initiallySelected);
        const actualListOfProducts = this.removeIndexesFromProducts(productsInCart);
        expect(actualListOfProducts).toEqual(expectedListOfProducts);
    }

    async assertPaymentIsSuccesfull(paymentState: boolean){
        expect(paymentState).toBeTruthy();
    }

}