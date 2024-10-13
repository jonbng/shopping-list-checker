import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Shopping List Checker",
    short_name: "ScanShop",
    description: "An app that checks items off your shopping list when you scan them",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/favicon.png",
        sizes: "100x100",
        type: "image/png",
      }
    ],
  };
}
