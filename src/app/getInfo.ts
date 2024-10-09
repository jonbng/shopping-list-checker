"use server";

export async function getInfo(barcode: string) {
    const raw_data = await fetch("https://world.openfoodfacts.org/api/v0/product/" + barcode + ".json");
    if (!raw_data.ok) {
        return { keywords: [], image_url: "" };
    }
    const json_data = await raw_data.json();

    if (!json_data.product) {
        return { keywords: [], image_url: "" };
    }
    const keywords = json_data.product._keywords;
    const image_url = json_data.product.image_url;

    if (!keywords || !image_url) {
        return { keywords: [], image_url: "" };
    }

    return { keywords, image_url };
}