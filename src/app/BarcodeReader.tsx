/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useRef, useEffect } from "react";
import Quagga from "@ericblade/quagga2";
import Scanner from "./Scanner";
import { getProductInfo } from "@/lib/krogerClient";
import PropTypes from "prop-types";

const BarcodeReader = ({ handleProduct }) => {
  const [results, setResults] = useState([]);
  const scannerRef = useRef(null);

  async function updateResults(result) {
    setResults([...results, result]); // For some obscure reason, this is necessary for the scanner to not trigger multiple times on the same barcode... I have no idea why
    const idkman = await getProductInfo(result);
    if ("vibrate" in navigator) navigator.vibrate(250);
    console.log("Product: ", idkman);
    handleProduct(idkman);
  }

  useEffect(() => {
    const enableCamera = async () => {
      await Quagga.CameraAccess.request(null, {});
    };
    const disableCamera = async () => {
      await Quagga.CameraAccess.release();
    };
    const enumerateCameras = async () => {
      const cameras = await Quagga.CameraAccess.enumerateVideoDevices();
      console.log("Cameras Detected: ", cameras);
      return cameras;
    };
    enableCamera()
      .then(disableCamera)
      .then(enumerateCameras)
      .then(() => Quagga.CameraAccess.disableTorch());
    return () => {
      disableCamera();
    };
  }, []);

  return (
    <div>
      <div ref={scannerRef} className="relative">
        <canvas
          className="drawingBuffer"
          style={{
            position: "absolute",
            top: "0px",
            left: "0px",
            height: "100%",
            width: "100%",
            overflow: "hidden",
          }}
          width="100%"
          height="100%"
        />
        <Scanner
          scannerRef={scannerRef}
          cameraId={null}
          onDetected={(result) => updateResults(result)}
        />
      </div>
    </div>
  );
};

BarcodeReader.propTypes = {
  onDetected: PropTypes.func.isRequired,
};

export default BarcodeReader;
