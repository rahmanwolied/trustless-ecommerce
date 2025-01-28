"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { sendOTP } from "@/server/otp";
import { toast } from "sonner";
import { CheckCircle, X } from "lucide-react";
import { useState } from "react";
import { VerifyOTPDialog } from "./verify-otp-dialog";
import { showToast } from "@/lib/toast";

const formSchema = z.object({
  phoneNumber: z.string().min(11, {
    message: "Phone number must be at least 11 digits.",
  }),
  nidNumber: z.string().min(10, {
    message: "NID number must be at least 10 characters.",
  }),
});

export function NIDForm() {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
      nidNumber: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await sendOTP(values.phoneNumber, values.nidNumber);
    if (response.success) {
      showToast.success(response.message);
      setOpen(true);
    } else {
      showToast.error(response.message);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-bangladesh-green">
                  Phone Number
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your phone number"
                    className="border-green-300 focus:border-bangladesh-green"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nidNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-bangladesh-green">
                  NID Number
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your NID number"
                    className="border-green-300 focus:border-bangladesh-green"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            <Button className="bg-bangladesh-red hover:bg-red-700 text-white transition-colors duration-300">
              Submit
            </Button>
          </div>
        </form>
      </Form>
      <VerifyOTPDialog
        open={open}
        setOpen={setOpen}
        nidNumber={form.getValues("nidNumber")}
      />
    </>
  );
}
