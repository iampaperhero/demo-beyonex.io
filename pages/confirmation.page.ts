import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class Confirmation extends BasePage {

    private readonly headerLabel: Locator;

    constructor(private confirmation: Page){
        super(confirmation);
        this.headerLabel = confirmation.locator("//h2[text()='PAYMENT SUCCESS']");
    }

    async isSuccessfulPayment(): Promise<boolean>{
        await this.waitForPageLoad();
        return await this.headerLabel.isVisible();
    }

}