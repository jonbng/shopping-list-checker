"use server";

import { getProduct } from "kroger-api-wrapper";
import { getKrogerToken } from "./krogerClient";

export interface ProductType {
    name: string;
    image_url: string;
    price: string;
    upc: string;
    categories: string[];
}

export async function getInfo(barcode: string) {
    console.log("Getting info for barcode: ", barcode);

    const king_soopers_barcode = "0" + barcode.slice(0, -1)
    
    // console.log("King Soopers Barcode: ", king_soopers_barcode);

    const krogerAcessToken = await getKrogerToken();

    if (!krogerAcessToken) {
        return { product: {} };
    }

    // console.log("Kroger Access Token: ", krogerAcessToken);

    const response = await getProduct({ token: krogerAcessToken, id: king_soopers_barcode, filters: { locationId: "62000022" } });

    if (!response) {
        return { product: {} };
    }

    const responseData = response.data.data;

    if (!responseData) {
        return { product: {} };
    }

    // console.log("response: ", responseData);

    // Find featured image or first image
    const featuredImage = responseData.images.find((image) => image.featured) || responseData.images[0];

    const product: ProductType = {
        image_url: featuredImage.sizes[0].url,
        name: responseData.description,
        price: responseData.items[0].price.regular,
        upc: responseData.upc,
        categories: responseData.categories
    };

    console.log("Product: ", product);

    return product;
}
