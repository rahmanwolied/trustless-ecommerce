"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Label } from "../../components/ui/label";
import Link from "next/link";
import { pollForProof, requestNidProof, requestSellerProof } from "@repo/ssi";
import { QRCode } from "../components/qr-code";
import { useConnectionIdAtom } from "@/lib/atoms/connection-id-atom";
import { showToast } from "@/lib/toast";
import { Loader } from "lucide-react";
import { login } from "./login";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [connectionId] = useConnectionIdAtom();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [state, setState] = useState("Send Verification Request");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleContinue = async () => {
    if (!connectionId) {
      showToast.error("No connection ID found");
      return;
    }

    if (selectedOption === "seller") {
      setLoading(true);
      setState("Sending Seller License Verification Request...");
      const { data, success, message } = await requestSellerProof(connectionId);

      if (!success) {
        showToast.error(message);
        setLoading(false);
        return;
      }

      setState("Waiting for verification...");
      const verified = await pollForProof(data.pres_ex_id);

      if (!verified) {
        showToast.error("Error verifying Seller License");
        setLoading(false);
        return;
      }

      await login(
        "seller",
        true,
        verified.by_format?.pres?.indy?.requested_proof.revealed_attrs[
          "company_name"
        ].raw || "",
        verified.by_format?.pres?.indy?.requested_proof.revealed_attrs[
          "company_address"
        ].raw || "",
        verified.by_format?.pres?.indy?.requested_proof.revealed_attrs[
          "phone_number"
        ].raw || ""
      );
    } else {
      setLoading(true);
      setState("Sending NID Verification Request...");
      const { data, success, message } = await requestNidProof(connectionId);

      if (!success) {
        showToast.error(message);
        setLoading(false);
        return;
      }

      setState("Waiting for verification...");
      const verified = await pollForProof(data.pres_ex_id);
      if (!verified) {
        showToast.error("Error verifying NID");
        setLoading(false);
        return;
      }

      await login(
        "buyer",
        true,
        verified.by_format?.pres?.indy?.requested_proof.revealed_attrs[
          "first_name"
        ].raw || "",
        "",
        ""
      );
    }
    setState("Verification successful. Logging in...");
    setLoading(false);
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md bg-background/50 backdrop-blur-sm border border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center neon-text">
            How do you want to login?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <QRCode />
          <RadioGroup
            onValueChange={setSelectedOption}
            className="flex flex-col space-y-4"
          >
            <div className="flex items-center space-x-2 p-2 rounded-md transition-colors hover:bg-primary/10">
              <RadioGroupItem value="buyer" id="buyer" />
              <Label htmlFor="buyer" className="text-lg cursor-pointer">
                Buyer
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded-md transition-colors hover:bg-primary/10">
              <RadioGroupItem value="seller" id="seller" />
              <Label htmlFor="seller" className="text-lg cursor-pointer">
                Seller
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-4">
          <Button
            className="w-full"
            disabled={!selectedOption}
            onClick={handleContinue}
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>{state}</span>
              </>
            ) : (
              <span>{state}</span>
            )}
          </Button>
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
