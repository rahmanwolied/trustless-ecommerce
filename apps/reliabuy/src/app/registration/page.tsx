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

export default function RegistrationPage() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md bg-background/50 backdrop-blur-sm border border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center neon-text">
            How do you want to be registered?
          </CardTitle>
        </CardHeader>
        <CardContent>
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
            onClick={() => {
              if (
                selectedOption === "seller" &&
                typeof window !== "undefined"
              ) {
                window.open("http://localhost:3000", "_blank");
              } else {
                window.open("http://localhost:3001", "_blank");
              }
            }}
          >
            Continue
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
