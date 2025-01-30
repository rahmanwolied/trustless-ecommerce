"use server";

import { prisma } from "@repo/db";

interface TrustModelData {
  buyerName: string[];
  amount: number[];
  tTime: number[];
  star: number[];
  picture: number[];
  video: number[];
  lengthGreaterThanTwenty: number[];
}

const LAMBDA = 0.00000001;
const TIME_INTERVAL = 2592000;

export async function computeTrustFactor(data: TrustModelData) {
  // Compute Cumulative Transaction Amount
  const M_n = data.amount.reduce((sum, value) => sum + value, 0);
  console.log("Cumulative transaction amount:", M_n);

  // Compute Mean Transaction Amount
  const mean = M_n / data.amount.length;
  console.log("Mean transaction amount:", mean);

  // Ratio of mean transaction amount to average product price (Assume avg_product_price = 100)
  const avg_product_price = 16;
  const ratio_mean_avgprice = mean / avg_product_price;
  console.log("Ratio of mean to avg product price:", ratio_mean_avgprice);

  // Confidence Coefficient
  const confidence_coefficient = Math.exp(-1 / ratio_mean_avgprice);
  console.log("Confidence Coefficient:", confidence_coefficient * 100, "%");

  // Transaction Diversity Calculation
  const buyerCounts = data.buyerName.reduce<Record<string, number>>(
    (acc, buyer) => {
      acc[buyer] = (acc[buyer] || 0) + 1;
      return acc;
    },
    {}
  );

  const totalTransactions = data.buyerName.length;
  console.log("Total transactions:", totalTransactions);
  const diversity =
    1 -
    Object.values(buyerCounts).reduce(
      (sum, count) => sum + (count / totalTransactions) ** 2,
      0
    );
  console.log("Transaction Diversity:", diversity * 100, "%");

  // Time Decay Calculation
  const lambda = LAMBDA;
  const j = TIME_INTERVAL; // Predefined time interval

  const tn = Math.max(...data.tTime);

  const timeDecay = data.tTime.map((tk) => {
    let delta_t = tn - tk;
    return delta_t > j ? Math.exp(-lambda * delta_t) : 1;
  });
  //console.log("Time Decay Values:", timeDecay);

  // User Experience Calculation
  const userExp = data.star.map((star, index) => {
    if (star === 0) return 0.5; // If there are no reviews, user experience is 0.5.

    let newLength =
      star < 3
        ? data.lengthGreaterThanTwenty[index] === 0
          ? 1
          : 0
        : data.lengthGreaterThanTwenty[index];

    let newVideo =
      star < 3 ? (data.video[index] === 0 ? 1 : 0) : data.video[index];
    let newPicture =
      star < 3 ? (data.picture[index] === 0 ? 1 : 0) : data.picture[index];
    let sum = star + newVideo + newLength + newPicture;
    return (sum / 8) * (star / 5);
  });

  const timeDecayUserExp = timeDecay.map(
    (decay, index) => decay * userExp[index]
  );
  const userExpMean =
    timeDecayUserExp.reduce((sum, value) => sum + value, 0) /
    timeDecayUserExp.length;
  console.log("User Experience:", userExpMean);

  // Reputation Factor Calculation
  const reputationFactor =
    Math.cbrt(confidence_coefficient * diversity * userExpMean) * 100;
  console.log("Reputation Factor:", reputationFactor.toFixed(2), "%");
  return reputationFactor;
}

export async function updateTrustFactor(sellerId: string) {
  const purchases = await prisma.purchase.findMany({
    where: {
      sellerId: sellerId,
    },
  });

  const data: TrustModelData = {
    buyerName: purchases.map((purchase) => purchase.buyerFirstName),
    amount: purchases.map((purchase) => purchase.amount),
    tTime: purchases.map((purchase) => purchase.tTime.getTime()),
    star: purchases.map((purchase) => purchase.star),
    picture: purchases.map((purchase) => (purchase.picture ? 1 : 0)),
    video: purchases.map((purchase) => (purchase.video ? 1 : 0)),
    lengthGreaterThanTwenty: purchases.map((purchase) =>
      purchase.review.length > 20 ? 1 : 0
    ),
  };
  const trustFactor = await computeTrustFactor(data);

  await prisma.seller.update({
    where: { id: sellerId },
    data: { trustFactor },
  });
}
