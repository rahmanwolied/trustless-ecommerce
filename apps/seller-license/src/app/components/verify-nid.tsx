import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useProgress } from "@/lib/atoms/progress-atom";
import { useState } from "react";
import { Loader } from "lucide-react";
import { pollForProof, requestNidProof } from "@repo/ssi";
import { useConnectionIdAtom } from "@/lib/atoms/connection-id-atom";
import { showToast } from "@/lib/toast";
import { useFormAtom } from "@/lib/atoms/form-atom";

export function VerifyNID({ setStep }: { setStep: (step: number) => void }) {
  const [, setFormData] = useFormAtom();
  const [connectionId] = useConnectionIdAtom();
  const [, setProgress] = useProgress();
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState("Send Verification Request");

  const handleVerifyNID = async () => {
    try {
      setIsLoading(true);
      setState("Sending Verification Request...");
      if (!connectionId) {
        showToast.error("No connection ID found");
        return;
      }
      const { data, success, message } = await requestNidProof(connectionId);
      if (!success) {
        showToast.error(message);
        setProgress(["complete", "failed", "upcoming", "upcoming"]);
        return;
      }
      setState("Waiting for verification...");
      const verified = await pollForProof(data.pres_ex_id);
      if (!verified) {
        showToast.error("Error verifying NID");
        setProgress(["complete", "failed", "upcoming", "upcoming"]);
        return;
      }
      setFormData({
        nidNumber:
          verified.by_format?.pres?.indy?.requested_proof.revealed_attrs.nid
            .raw || "",
        firstName:
          verified.by_format?.pres?.indy?.requested_proof.revealed_attrs
            .first_name.raw || "",
        lastName:
          verified.by_format?.pres?.indy?.requested_proof.revealed_attrs
            .last_name.raw || "",
      });
      setProgress(["complete", "complete", "current", "upcoming"]);
      setState("Verification successful");
      setStep(2);
    } catch (error) {
      showToast.error("Error requesting NID proof");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="flex flex-col items-center pt-6">
        <div className="w-32 h-32 bg-gray-200 rounded-lg mb-6 flex items-center justify-center">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/1/1c/Government_of_Bangladesh_Logo_%28unofficial_and_fictional_logo%29.png?height=80&width=80"
            alt="Government of Bangladesh Logo"
            width={80}
            height={80}
            className="mx-auto"
          />
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Verify Your National ID
        </h2>

        <p className="text-gray-600 text-center mb-6">
          Please verify your National ID using a verifiable credential
        </p>

        <Button
          className="w-full bg-red-500 hover:bg-red-600 text-white mb-6"
          onClick={handleVerifyNID}
        >
          {isLoading ? (
            <>
              <Loader className="animate-spin" />
              <span className="ml-2">{state}</span>
            </>
          ) : (
            state
          )}
        </Button>

        <div className="text-sm text-gray-600">
          Don&apos;t have an NID verifiable credential?{" "}
          <a
            href="http://localhost:3001"
            className="text-red-500 hover:text-red-600"
          >
            Get one here
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
