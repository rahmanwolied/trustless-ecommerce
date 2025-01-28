import { prisma } from "./client";

async function main() {
  // Clear all records from the Nid table
  console.log("🗑️  Clearing all records from the Nid table...");
  await prisma.nid.deleteMany({});
  console.log("✨ Cleared all records from the Nid table");

  console.log("🌱 Starting to seed database...");

  console.log("👩 Creating Alice's record...");
  const alice = await prisma.nid.upsert({
    where: { nidNumber: "2222222222" },
    update: {},
    create: {
      firstName: "Alice",
      lastName: "Doe",
      dateOfBirth: new Date("1990-01-01"),
      gender: "Female",
      address: "123 Main St, Anytown, USA",
      phoneNumber: "01819192975",
    },
  });
  console.log("✅ Created Alice's record");

  console.log("👨 Creating Bob's record...");
  const bob = await prisma.nid.upsert({
    where: { nidNumber: "1111111111" },
    update: {},
    create: {
      nidNumber: "1111111111",
      firstName: "Bob",
      lastName: "Doe",
      dateOfBirth: new Date("1990-01-01"),
      gender: "Male",
      address: "123 Main St, Anytown, USA",
      phoneNumber: "01783796773",
    },
  });
  console.log("✅ Created Bob's record");

  console.log("👨 Creating Charlie's record...");
  const charlie = await prisma.nid.upsert({
    where: { nidNumber: "3333333333" },
    update: {},
    create: {
      firstName: "Charlie",
      lastName: "Smith",
      dateOfBirth: new Date("1992-03-15"),
      gender: "Male",
      address: "456 Oak Rd, Somewhere, USA",
      phoneNumber: "01712345678",
    },
  });
  console.log("✅ Created Charlie's record");

  console.log("👩 Creating Diana's record...");
  const diana = await prisma.nid.upsert({
    where: { nidNumber: "4444444444" },
    update: {},
    create: {
      firstName: "Diana",
      lastName: "Johnson",
      dateOfBirth: new Date("1988-07-22"),
      gender: "Female",
      address: "789 Pine Ave, Elsewhere, USA",
      phoneNumber: "01898765432",
    },
  });
  console.log("✅ Created Diana's record");

  console.log("👩 Creating Eve's record...");
  const eve = await prisma.nid.upsert({
    where: { nidNumber: "5555555555" },
    update: {},
    create: {
      firstName: "Eve",
      lastName: "Wilson",
      dateOfBirth: new Date("1995-11-30"),
      gender: "Female",
      address: "321 Elm St, Nowhere, USA",
      phoneNumber: "01654321098",
    },
  });
  console.log("✅ Created Eve's record");

  console.log("✨ Database seeding completed!");
  console.log("📊 Summary of created records...", {
    alice,
    bob,
    charlie,
    diana,
    eve,
  });
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
