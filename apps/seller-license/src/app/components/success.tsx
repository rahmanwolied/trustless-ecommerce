import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export function Success() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center pt-6">
        <div className="w-16 h-16 flex items-center justify-center mb-6">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-4">Success!</h2>

        <p className="text-gray-600 text-center mb-4">
          Your seller license has been sent to your wallet. You should receive
          it shortly.
        </p>

        <p className="text-sm text-gray-500 text-center">
          Please check your wallet app to view and store your credential. You
          can use this credential to prove your seller status in the future.
        </p>
      </CardContent>
    </Card>
  );
}
