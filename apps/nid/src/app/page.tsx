import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QRCode } from "./components/qr-code";
import Image from "next/image";
import { NIDForm } from "./components/nid-form";

export default function BangladeshGovVerification() {
  return (
    <div className="min-h-screen bg-[#f8f8f8] flex items-center justify-center p-4 relative">
      <Card className="w-full max-w-2xl bg-white bg-opacity-95 shadow-lg transition-all duration-300 hover:shadow-xl relative z-10">
        <CardHeader className="text-center border-b border-green-500">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/1/1c/Government_of_Bangladesh_Logo_%28unofficial_and_fictional_logo%29.png?height=80&width=80"
            alt="Government of Bangladesh Logo"
            width={80}
            height={80}
            className="mx-auto mb-4 "
          />
          <CardTitle className="text-2xl font-bold text-bangladesh-green">
            Self Sovereign National ID
          </CardTitle>
          <CardDescription>
            Get Your National Id Verifiable Credential NOT By Bangladesh
            Government
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-6">
          <QRCode />
          <NIDForm />
        </CardContent>
      </Card>
    </div>
  );
}
