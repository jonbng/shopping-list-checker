"use client";

import { useState } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { getInfo } from "./getInfo";

export default function Home() {
  const [data, setData] = useState("");
  const [info, setInfo] = useState({ keywords: [], image_url: "" });

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <BarcodeScannerComponent
        width={400}
        height={400}
        onUpdate={async (err, result) => {
          if (result) {
            setData(result.getText());
            const info = await getInfo(data);
            console.log(info);
            setInfo(info);
          }
        }}
      />
      <div className="text-center">
        <h1 className="text-2xl font-bold">QR Code Scanner</h1>
        <p className="text-lg">Scanning...</p>
        <p className="text-lg">{data}</p>
        <p className="text-lg">{info.keywords.join(", ")}</p>
        <img src={info.image_url} alt="Product" className="w-48 h-48" />
      </div>
    </div>
  );
}
