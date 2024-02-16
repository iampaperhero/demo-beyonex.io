import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";
import { Product } from "../interfaces/product.interface";
import { StripeFrame } from "./components/stripe.frame";

export class Checkout extends BasePage {

    private readonly payWithCardButton: Locator;
    private readonly items: Locator;

    constructor(private checkout: Page) {
        super(checkout);
        this.payWithCardButton = this.checkout.locator("//button");
        this.items = this.checkout.locator("//tbody/tr");
        super.waitForPageLoad();
    }

    async getProductsInCart(): Promise<Product[]>{
        await this.waitForPageLoad();

        const allItems = await this.items.all();

        const textContents: string[] = await Promise.all(
            allItems.map(async (locator) => {
              const textContent = await locator.textContent();
              return textContent || '';
            })
          );

          const parsedProducts: Product[] = textContents.map((text, index) => {
            const regexResult = /\s*([\w\s-]+)\s+(\d+)/.exec(text);
            if (regexResult) {
              const name = regexResult[1].trim();
              const price = parseInt(regexResult[2], 10);
              return { name, price, index };
            }
            return undefined;
          }).filter((product): product is Product => product !== undefined);
          
        return parsedProducts;
    }

    async clickPayWithCard(): Promise<StripeFrame>{
        await this.payWithCardButton.click();
        return new StripeFrame(this.checkout);
    }

}