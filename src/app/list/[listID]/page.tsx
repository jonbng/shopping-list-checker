"use client";

import { useState } from "react";
import BarcodeReader from "../../BarcodeReader";
import { ProductType } from "../../../lib/getInfo";

export default function Scanner() {
  const [product, setProduct] = useState<ProductType | null>(null);

  const handleProduct = (product: ProductType) => {
    setProduct(product);
  };

  return (
    <div className="overflow-hidden">
      <div className="">
        <BarcodeReader handleProduct={(product) => handleProduct(product)} />
      </div>
      <div>
        {product && (
          <div>
            <img src={product.image_url} alt={product.name} />
            <div>{product.name}</div>
            <div>{product.price}</div>
            <div>{product.upc}</div>
            <div>{product.categories}</div>
          </div>
        )}
      </div>
    </div>
  );
}
