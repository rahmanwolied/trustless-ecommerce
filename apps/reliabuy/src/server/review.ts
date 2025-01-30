"use server";
import { Purchase } from "@repo/db";

import { prisma } from "@repo/db";
import { updateTrustFactor } from "./trust-model";

export const review = async (
  order: Purchase,
  starCount: number,
  picture: string,
  video: string,
  review: string,
  seller: string
) => {
  await prisma.purchase.update({
    where: { id: order.id },
    data: { star: starCount, picture, video, review },
  });

  await updateTrustFactor(seller);
};
