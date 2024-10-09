"use server";

export async function getInfo(barcode: string) {
    const raw_data = await fetch("https://world.openfoodfacts.org/api/v0/product/" + barcode + ".json");
    const json_data = await raw_data.json();

    const keywords = json_data.product._keywords;
    const image_url = json_data.product.image_url;

    return { keywords, image_url };
}