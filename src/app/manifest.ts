import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ScanShop",
    short_name: "ScanShop",
    description:
      "An app that checks items off your shopping list when you scan them",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/favicon.png",
        sizes: "100x100",
        type: "image/png",
      },
      {
        src: "/favicon.svg",
        type: "image/svg+xml",
      },
      {
        src: "/favicon.ico",
        sizes: "64x64 32x32 24x24 16x16",
        type: "image/x-icon",
      }
    ],
  };
}
