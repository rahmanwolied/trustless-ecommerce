"use client";

import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";
import { useState } from "react";

export function QRCode() {
  const [qrCode, setQrCode] = useState(
    "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=InitialQRCode"
  );
  const regenerateQR = async () => {
    const newData = `QRCode${Math.random()}`;

    setQrCode(
      `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${newData}`
    );
  };
  return (
    <div className="flex flex-col items-center mb-6">
      <div className="bg-white p-2 rounded-lg shadow-md mb-4">
        <img
          src={qrCode || "/placeholder.svg"}
          alt="QR Code"
          className="w-40 h-40"
        />
      </div>
      <p className="text-center text-gray-600 mb-4">
        Please scan the QR code to initiate the verification process
      </p>
      <Button
        onClick={regenerateQR}
        className="bg-bangladesh-green hover:bg-green-700 text-white transition-colors duration-300"
      >
        <QrCode className="mr-2 h-4 w-4" /> Regenerate QR Code
      </Button>
    </div>
  );
}
