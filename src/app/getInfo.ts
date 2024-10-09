"use server";

export async function getInfo(barcode: string) {

    return { message: "Hello, World!" + barcode };
}