"use client";

import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { showToast } from "@/lib/toast";
import { createConnection, pollForConnection } from "@repo/ssi";
import { Loader } from "lucide-react";
import { useConnectionIdAtom } from "@/lib/atoms/connection-id-atom";

const QR_CODE_SIZE = 250;
const QR_CODE_URL = `https://api.qrserver.com/v1/create-qr-code/?size=${QR_CODE_SIZE}x${QR_CODE_SIZE}&data=`;

export function QRCode() {
  const [qrCode, setQrCode] = useState(QR_CODE_URL);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionId, setConnectionId] = useConnectionIdAtom();

  useEffect(() => {
    regenerateQR();
  }, []);

  const regenerateQR = async () => {
    try {
      setConnectionId(null);
      const response = await createConnection();
      if (response.success) {
        console.log("response", response.data);
        setQrCode(QR_CODE_URL + response.data.invitation_url);
        setIsLoading(true);

        const connection = await pollForConnection(response.data.invi_msg_id);

        if (connection) setConnectionId(connection.connection_id);
      }
    } catch (error) {
      showToast.error("Failed to generate QR code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mb-6">
      <div className="bg-white p-2 rounded-lg shadow-md mb-4">
        <Image
          src={qrCode || "/placeholder.svg"}
          alt="QR Code"
          width={250}
          height={250}
        />
      </div>
      <p className="text-center text-gray-600 mb-4">
        Please scan the QR code to initiate the verification process
      </p>
      <Button
        onClick={regenerateQR}
        className="bg-bangladesh-green hover:bg-green-700 text-white transition-colors duration-300"
      >
        {isLoading ? (
          <Loader className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <QrCode className="mr-2 h-4 w-4" />
        )}
        {isLoading ? "Waiting for connection..." : "Regenerate QR Code"}
      </Button>
      <p className="text-center text-xs bg-gray-100 p-1 rounded-md text-gray-600 my-4">
        {connectionId
          ? `Connection ID: ${connectionId}`
          : "Waiting for connection..."}
      </p>
    </div>
  );
}
