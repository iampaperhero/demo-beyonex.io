import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";
import { MoisturizersContents } from "../enums/moisturizersContents";
import { SunscreenTypes } from "../enums/sunscreenTypes";
import { Product } from "../interfaces/product.interface"
import { Checkout } from "./checkout.page";

export class SkincareShop extends BasePage {

    private readonly cartButton: Locator;
    private readonly addButton: Locator;
    readonly selectedProducts: Product[] = [];

    constructor(private skincareShop: Page) {
        super(skincareShop);
        this.cartButton = this.skincareShop.locator(`//button[@OnClick='goToCart()']`);
        this.addButton = this.skincareShop.locator(`//button[text()='Add']`);
    }

    private async getAllItemsAttribute(): Promise<Product[]> {
        await this.waitForPageLoad();

        const locators = await this.addButton.all();

        const cartItems: string[] = await Promise.all(locators.map(async locator => {
            const text = await locator.evaluate(el => el.getAttribute("onclick"));
            return text || '';
        }));

        const parsedProducts: Product[] = cartItems.map((cartItem, index) => {
            const regexResult = /addToCart\('([^']+)',(\d+)\)/.exec(cartItem);

            if (regexResult) {
                const name = regexResult[1];
                const price = parseInt(regexResult[2], 10);
                return { name, price, index };
            }

            return undefined;
        }).filter((product): product is Product => product !== undefined);

        return parsedProducts
    }

    async selectLeastExpensiveProductIndex(contentType: MoisturizersContents | SunscreenTypes) {

        const parsedProducts = await this.getAllItemsAttribute();

        const cheapestProductIndex = parsedProducts
            .filter(product => product.name.toLowerCase().includes(contentType.toLowerCase()))
            .reduce((minIndex, currentProduct) =>
                currentProduct.price < parsedProducts[minIndex].price ? currentProduct.index : minIndex, 0);

        const cheapestProduct = parsedProducts[cheapestProductIndex];
        this.selectedProducts.push(cheapestProduct);

        await this.addButton.nth(cheapestProductIndex).click();
    }

    async clickCartButton(): Promise<Checkout>{
        await this.cartButton.click();
        return new Checkout(this.skincareShop);
    }

}