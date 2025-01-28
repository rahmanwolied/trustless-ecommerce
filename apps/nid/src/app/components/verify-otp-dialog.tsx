import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog";
import { InputOTPForm } from "./otp-form";

interface VerifyOTPDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  nidNumber: string;
}

export function VerifyOTPDialog({
  open,
  setOpen,
  nidNumber,
}: VerifyOTPDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen} modal={true}>
      <DialogPortal>
        <DialogContent className="flex flex-col items-center">
          <DialogHeader>
            <DialogTitle className="text-2xl text-bangladesh-green">
              Verify OTP
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-center">
            Please enter the OTP sent to your phone number
          </DialogDescription>
          <InputOTPForm nidNumber={nidNumber} />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
