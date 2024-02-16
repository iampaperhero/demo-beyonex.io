import { Locator, Page } from "@playwright/test";
import { Skincare } from "../enums/skincare";
import { SkincareShop } from "./skincareShop.page";
import { BasePage } from "./base.page";

export class CurrentTemperature extends BasePage {
    private readonly temperatureLabel: Locator;
    private readonly buyButton: (id: Skincare) => Locator;

    constructor(private currentTemperature: Page) {
        super(currentTemperature);
        this.temperatureLabel = this.currentTemperature.locator("//span[@id='temperature']");
        this.buyButton = (id: Skincare) => this.currentTemperature.locator(`//button[text()="Buy ${id}"]`);
    }

    private async getCurrentTemperature(): Promise<number> {
        const labelText = await this.temperatureLabel.textContent();

        if (labelText !== null) {
            return parseInt(labelText);
        } else {
            throw new Error("Temperature text is not available.");
        }
    }

    /**
     * To prevent test fragility, we use this method to poll the main page 
     * until the temperature level is suitable for running the test.
     * 
     * In the event that the skincare product is not defined, an error will be thrown.
     * 
     * If the temperature is outside the specified bounds, 
     * the page will be reloaded until it meets the requirements.
     */

    private async pollPageUntilTemperatureConditionMet(
        belowDegrees: number,
        aboveDegrees: number,
        skincareProduct: Skincare
    ): Promise<void> {
        const currentTemperature = await this.getCurrentTemperature();

        switch (skincareProduct) {
            case Skincare.SUNSCREENS:
                if (!(currentTemperature > aboveDegrees)) {
                    await this.currentTemperature.reload();
                    await this.pollPageUntilTemperatureConditionMet(belowDegrees, aboveDegrees, skincareProduct);
                }
                break;

            case Skincare.MOISTURIZERS:
                if (!(currentTemperature < belowDegrees)) {
                    await this.currentTemperature.reload();
                    await this.pollPageUntilTemperatureConditionMet(belowDegrees, aboveDegrees, skincareProduct);
                }
                break;

            default:
                throw new Error(`Unsupported Skincare product: ${skincareProduct}`);
        }
    }

    async selectSkincareProduct(skincareProduct: Skincare): Promise<SkincareShop> {
        await this.pollPageUntilTemperatureConditionMet(19, 34, skincareProduct);
        await this.buyButton(skincareProduct).click();
        return new SkincareShop(this.currentTemperature);
    }

}