"use server";

import { getProduct } from "kroger-api-wrapper";
import { getClientToken } from "kroger-api-wrapper/lib";

const clientBase64 = process.env.KROGER_CLIENT_BASE64;
const scope = "product.compact";

export interface ProductType {
  name: string;
  image_url: string;
  price: string;
  upc: string;
  categories: string[];
}

export async function getKrogerToken() {
  const response = await getClientToken({
    clientBase64,
    scope,
  });

  return response.data.access_token;
}

export async function getProductInfo(barcode: string) {
  console.log("Getting info for barcode: ", barcode);

  const king_soopers_barcode = "0" + barcode.slice(0, -1);

  // console.log("King Soopers Barcode: ", king_soopers_barcode);

  const krogerAcessToken = await getKrogerToken();

  if (!krogerAcessToken) {
    return false;
  }

  // console.log("Kroger Access Token: ", krogerAcessToken);

  const response = await getProduct({
    token: krogerAcessToken,
    id: king_soopers_barcode,
    filters: { locationId: "62000022" },
  }).catch((error) => {
    console.error("Error getting product: ", error);
  });

  if (!response || !response.data) {
    return false;
  }

  const responseData = response.data.data;

  if (!responseData) {
    return false;
  }

  // console.log("response: ", responseData);

  // Find featured image or first image
  const featuredImage =
    responseData.images.find((image) => image.featured) ||
    responseData.images[0];

  const product: ProductType = {
    image_url: featuredImage.sizes[0].url,
    name: responseData.description,
    price: responseData.items[0].price.regular,
    upc: responseData.upc,
    categories: responseData.categories,
  };

  console.log("Product: ", product);

  return product;
}
