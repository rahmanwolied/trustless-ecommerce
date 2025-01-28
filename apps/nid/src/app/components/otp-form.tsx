"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { DialogClose } from "@radix-ui/react-dialog";
import { verifyOTP } from "@/server/otp";

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

interface InputOTPFormProps {
  nidNumber: string;
}

export function InputOTPForm({ nidNumber }: InputOTPFormProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const result = await verifyOTP(nidNumber, data.pin);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-center space-y-6"
        >
          <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
              <FormItem className="w-full flex flex-col items-center">
                <FormControl>
                  <InputOTP
                    maxLength={6}
                    {...field}
                    pattern={REGEXP_ONLY_DIGITS}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription>
                  Please enter the one-time password sent to your phone.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              className="w-full hover:bg-bangladesh-green hover:text-white"
              type="submit"
            >
              Submit
            </Button>
            <DialogClose>
              <Button
                variant="outline"
                className="w-full hover:bg-bangladesh-red hover:text-white"
              >
                Cancel
              </Button>
            </DialogClose>
          </div>
        </form>
      </Form>
    </div>
  );
}
