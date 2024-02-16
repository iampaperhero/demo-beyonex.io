import { Product } from "../interfaces/product.interface";

export class ProductHelper {
    public static removeIndex(product: Product): Omit<Product, 'index'> {
        const { index, ...rest } = product;
        return rest;
    }

    public static removeIndexesFromProducts(listOfProducts: Product[]): Omit<Product, 'index'>[] {
        return listOfProducts.map(ProductHelper.removeIndex);
    }
    
}