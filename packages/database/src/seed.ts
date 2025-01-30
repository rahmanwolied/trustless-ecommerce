import { prisma } from "./client";

const products = [
  {
    name: "Wireless Earbuds",
    price: 79.99,
    rating: 4.5,
    purchases: 1200,
    image:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi5.walmartimages.com%2Fasr%2F01f45e55-1e7d-4b2c-9983-abd6499b8e68_1.42b65de79c231959bc7711ac356b69fb.jpeg%3FodnWidth%3D1000%26odnHeight%3D1000%26odnBg%3Dffffff&f=1&nofb=1&ipt=9d10b477195b94a24af374fba510bd43f90847a9396814f508853d5f195a7f0b&ipo=images",
  },
  {
    name: "Smart Watch",
    price: 199.99,
    rating: 4.2,
    purchases: 800,
    image:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.bhphotovideo.com%2Fimages%2Fimages2500x2500%2Fapple_mj3t2ll_a_watch_sport_smartwatch_42mm_1187199.jpg&f=1&nofb=1&ipt=464831fc78445c2b88d7d8eaab0a0151fef9e2e9c41d6d7662a874c27248de9d&ipo=images",
  },
  {
    name: "Portable Charger",
    price: 49.99,
    rating: 4.7,
    purchases: 2000,
    image:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.SlCgYz4cbcWq2FY3hqIr7gHaH8%26pid%3DApi&f=1&ipt=3d85e3472aacb38dd481b1a3e7b53224b3a17ba614266c53fb08b0ca5f09fc24&ipo=images",
  },
  {
    name: "Bluetooth Speaker",
    image:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi5.walmartimages.com%2Fasr%2Fcdaaab64-5ea7-4d8f-969f-cff666244723.ff62693361b001ebbaf41145d23c0f13.jpeg&f=1&nofb=1&ipt=f24336124edc38de6b345de077188d60d4fe17e1aad8c050528cfd42d412987d&ipo=images",
    price: 89.99,
    rating: 4.3,
    purchases: 1500,
  },
];

const nids = [
  {
    nidNumber: "2222222222",
    firstName: "Alice",
    lastName: "Doe",
    dateOfBirth: new Date("1990-01-01"),
    gender: "Female",
    address: "123 Main St, Anytown, USA",
    phoneNumber: "01819192975",
  },
  {
    nidNumber: "1234567890",
    firstName: "Mosheur",
    lastName: "Rahman",
    dateOfBirth: new Date("2000-02-27"),
    gender: "Male",
    address: "Dhaka, Bangladesh",
    phoneNumber: "01783796773",
  },
];

async function main() {
  // Clear all records from the Nid table
  console.log("🗑️  Clearing all records from the Nid table...");

  await prisma.nid.deleteMany({});
  await prisma.product.deleteMany({});

  console.log("✨ Cleared all records from the Nid table");

  console.log("🌱 Starting to seed database...");

  await prisma.nid.createMany({
    data: nids,
  });

  await prisma.product.createMany({
    data: products.map((product) => ({
      ...product,
      sellerId: "cm6itu3cx0000q9pb6c0dy0qi",
    })),
  });

  console.log("✨ Database seeding completed!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    //@ts-ignore
    process.exit(1);
  });
