"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SellerLicenseForm({
  setStep,
}: {
  setStep: (step: number) => void;
}) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    businessName: "",
    businessType: "",
    taxId: "",
    bankAccountNumber: "",
    routingNumber: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Here you would typically send the data to your backend
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-[#1F2937]">
          Seller Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#1F2937]">
              Personal Information
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#1F2937]">
              Business Information
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  name="businessName"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type</Label>
                <Select
                  name="businessType"
                  onValueChange={(value) =>
                    setFormData({ ...formData, businessType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="soleProprietor">
                      Sole Proprietor
                    </SelectItem>
                    <SelectItem value="llc">LLC</SelectItem>
                    <SelectItem value="corporation">Corporation</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxId">Tax Identification Number (TIN)</Label>
                <Input
                  id="taxId"
                  name="taxId"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full text-white transition-colors duration-300"
          >
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
