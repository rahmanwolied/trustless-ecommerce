"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { CheckCircle, Loader2, Star } from "lucide-react";
import { Purchase } from "@repo/db";
import { review as updateReview } from "@/server/review";
import { showToast } from "@/lib/toast";
import { pollForProof, requestReceiptProof } from "@repo/ssi";
import { useConnectionIdAtom } from "@/lib/atoms/connection-id-atom";

export default function ReviewDialog({
  order,
  children,
  sellerId,
}: {
  order: Purchase;
  children: React.ReactNode;
  sellerId: string;
}) {
  const [connectionId] = useConnectionIdAtom();
  const [starCount, setStar] = useState(order.star);
  const [picture, setPicture] = useState(order.picture);
  const [video, setVideo] = useState(order.video);
  const [review, setReview] = useState(order.review);
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState("Submitting...");

  const handleSubmit = async () => {
    setIsLoading(true);
    setState("Waiting for valid receipt VC...");

    const { data, success, message } = await requestReceiptProof(
      connectionId,
      order.id
    );
    if (!success) {
      showToast.error(message);
      setIsLoading(false);
      return;
    }
    await pollForProof(data.pres_ex_id);

    await updateReview(order, starCount, picture, video, review, sellerId);
    setIsLoading(false);
    showToast.success("Review submitted successfully");
    setState("Review submitted successfully");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review Order {order.id}</DialogTitle>
          <DialogDescription>
            How would you rate your purchase?
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center space-x-2 my-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              onClick={() => setStar(star)}
              key={star}
              className={`h-8 w-8 cursor-pointer ${
                star <= starCount
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>

        <textarea
          className="w-full p-2 border rounded-md bg-background"
          placeholder="Write your review here..."
          rows={4}
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />

        <div className="flex gap-4 mt-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">
              Upload Picture
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full p-2 border rounded-md bg-background"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setPicture(file.name);
                }
              }}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">
              Upload Video
            </label>
            <input
              type="file"
              accept="video/*"
              className="w-full p-2 border rounded-md bg-background"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setVideo(file.name);
                }
              }}
            />
          </div>
        </div>

        <Button className="w-full mt-4" onClick={handleSubmit}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{state}</span>
            </>
          ) : (
            <>
              {state === "Review submitted successfully" && (
                <CheckCircle className="h-4 w-4" />
              )}
              <span>{state}</span>
            </>
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
