"use client";

import SellerLicenseForm from "./components/seller-license-form";
import { QRCode } from "./components/qr-code";
import { Progress } from "./components/progress";
import { useState } from "react";
import { VerifyNID } from "./components/verify-nid";
import { Success } from "./components/success";

export default function Page() {
  const [step, setStep] = useState(0);

  return (
    <div className="min-h-screen text-white p-8 bg-[#F8F9FA]">
      <h1 className="text-3xl font-bold mb-8 text-center text-[#1F2937]">
        Seller License
      </h1>
      <div className="max-w-4xl mx-auto grid grid-cols-2 gap-2 transition-all duration-300">
        {step === 0 && <QRCode setStep={setStep} />}
        {step === 1 && <VerifyNID setStep={setStep} />}
        {step === 2 && <SellerLicenseForm setStep={setStep} />}
        {step === 3 && <Success />}
        <div>
          <Progress />
        </div>
      </div>
    </div>
  );
}
