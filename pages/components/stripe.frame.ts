import { Locator, Page } from "@playwright/test";
import { Confirmation } from "../confirmation.page";

export class StripeFrame {

    private readonly stripeBody: Locator;
    private readonly emailInput: Locator;
    private readonly cardNumberInput: Locator;
    private readonly expirationDateInput: Locator;
    private readonly cvcInput: Locator;
    private readonly zipInput: Locator;
    private readonly payButton: Locator;

    constructor(private stripeFrame: Page) {
        this.stripeBody = stripeFrame.frameLocator(`iframe`).locator(`//div[@class='bodyView']`);
        this.emailInput = stripeFrame.frameLocator(`iframe`).locator(`//input[@id='email']`);
        this.cardNumberInput = stripeFrame.frameLocator(`iframe`).locator(`//input[@id='card_number']`);
        this.expirationDateInput = stripeFrame.frameLocator(`iframe`).locator(`//input[@id='cc-exp']`);
        this.cvcInput = stripeFrame.frameLocator(`iframe`).locator(`//input[@id='cc-csc']`);
        this.zipInput = stripeFrame.frameLocator(`iframe`).locator(`//input[@id='billing-zip']`)
        this.payButton = stripeFrame.frameLocator(`iframe`).locator(`//button[@id='submitButton']`);
    }

    async enterCardData(
        email: string,
        cardNumber: number,
        expirationDate: string,
        cvcInput: number
    ) {
        await this.stripeBody.waitFor();
        await this.emailInput.fill(email);
        await this.cardNumberInput.fill(cardNumber.toString());
        await this.expirationDateInput.fill(expirationDate.toString());
        await this.cvcInput.fill(cvcInput.toString());
    }

    async clickPay(): Promise<Confirmation>{
        await this.payButton.click();
        await this.stripeBody.waitFor({ state: 'hidden' });
        return new Confirmation(this.stripeFrame);
    }

}