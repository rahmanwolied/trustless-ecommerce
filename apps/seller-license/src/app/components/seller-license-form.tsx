"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { showToast } from "@/lib/toast";
import { useProgress } from "@/lib/atoms/progress-atom";
import { useFormAtom } from "@/lib/atoms/form-atom";
import { useConnectionIdAtom } from "@/lib/atoms/connection-id-atom";
import { sendSellerLicenseOffer } from "@repo/ssi";
import { Loader } from "lucide-react";

const formSchema = z.object({
  seller_first_name: z
    .string({ required_error: "First name is required" })
    .min(2, "First name must be at least 2 characters"),
  seller_last_name: z
    .string({ required_error: "Last name is required" })
    .min(2, "Last name must be at least 2 characters"),
  phone_number: z
    .string({ required_error: "Phone number is required" })
    .min(10, "Phone number must be at least 10 digits"),
  company_name: z
    .string({ required_error: "Company name is required" })
    .min(2, "Company name must be at least 2 characters"),
  type: z.enum(["soleProprietor", "llc", "corporation", "partnership"], {
    required_error: "Please select a business type",
  }),
  tin: z
    .string({ required_error: "TIN is required" })
    .min(9, "TIN must be at least 9 characters"),
  company_address: z
    .string({ required_error: "Company address is required" })
    .min(5, "Company address must be at least 5 characters"),
  seller_nid_number: z.string({ required_error: "NID number is required" }),
});

export default function SellerLicenseForm({
  setStep,
}: {
  setStep: (step: number) => void;
}) {
  const [connectionId] = useConnectionIdAtom();
  const [, setProgress] = useProgress();
  const [formAtomData] = useFormAtom();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      seller_first_name: formAtomData?.firstName || "Mosheur",
      seller_last_name: formAtomData?.lastName || "Rahman",
      seller_nid_number: formAtomData?.nidNumber || "1234567890",
      phone_number: "",
      company_name: "",
      type: undefined,
      tin: "",
      company_address: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setProgress(["complete", "complete", "complete", "current"]);
    console.log("Form submitted:", data);

    if (!connectionId) {
      showToast.error("No connection found");
      setProgress(["complete", "complete", "complete", "failed"]);
      return;
    }
    const response = await sendSellerLicenseOffer({
      connectionId,
      ...data,
    });
    if (!response.success) {
      showToast.error(response.message);
      setProgress(["complete", "complete", "complete", "failed"]);
      return;
    }
    showToast.success("Seller license offer sent successfully");
    setProgress(["complete", "complete", "complete", "complete"]);
    setStep(3);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-[#1F2937]">
          Seller Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#1F2937]">
                Personal Information
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="seller_first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="seller_last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="seller_nid_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NID Number</FormLabel>
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#1F2937]">
                Business Information
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="company_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select business type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="soleProprietor">
                            Sole Proprietor
                          </SelectItem>
                          <SelectItem value="llc">LLC</SelectItem>
                          <SelectItem value="corporation">
                            Corporation
                          </SelectItem>
                          <SelectItem value="partnership">
                            Partnership
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Identification Number (TIN)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full text-white transition-colors duration-300"
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
