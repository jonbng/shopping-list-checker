"use server";

import { getProduct } from "kroger-api-wrapper";
import { getKrogerToken } from "./krogerClient";

interface ProductType {
    name: string;
    image_url: string;
    price: string;
    upc: string;
    categories: string[];
    stocklevel: string;
}

export async function getInfo(barcode: string) {
    console.log("Getting info for barcode: ", barcode);

    const king_soopers_barcode = "0" + barcode.slice(0, -1)
    
    console.log("King Soopers Barcode: ", king_soopers_barcode);

    const krogerAcessToken = await getKrogerToken();

    console.log("Kroger Access Token: ", krogerAcessToken);

    const response = await getProduct({ token: krogerAcessToken, id: king_soopers_barcode, filters: { locationId: "62000022" } });
    const responseData = response.data;

    console.log("response: ", responseData);

    const product: ProductType = {
        image_url: responseData.images[0].sizes[0].url,
        name: responseData.description,
        price: responseData.items[0].price.regular,
        upc: responseData.upc,
        categories: responseData.categories,
        stocklevel: responseData.items[0].inventory.stockLevel,
    };

    return { product };
}
