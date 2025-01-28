"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { DialogClose } from "@/components/ui/dialog";
import { verifyOTP } from "@/server/otp";
import { showToast } from "@/lib/toast";
import { sendNidOffer } from "@repo/ssi";
import { useConnectionIdAtom } from "@/lib/atoms/connection-id-atom";

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

interface InputOTPFormProps {
  nidNumber: string;
}

export function InputOTPForm({ nidNumber }: InputOTPFormProps) {
  const [connectionId] = useConnectionIdAtom();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const result = await verifyOTP(nidNumber, data.pin);

    if (result.success) {
      showToast.success(result.message);
      if (connectionId)
        showToast.promise(
          "Sending NID offer...",
          "NID offer sent successfully",
          "Failed to send NID offer",
          sendNidOffer({ ...result.data, connectionId })
        );
    } else {
      showToast.error(result.message);
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
              <div className="h-9 px-4 py-2 border border-input bg-background shadow-sm w-full hover:bg-bangladesh-red hover:text-white inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
                Cancel
              </div>
            </DialogClose>
          </div>
        </form>
      </Form>
    </div>
  );
}
