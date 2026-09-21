const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const adminEmail = (process.env.ADMIN_DEFAULT_EMAIL || "admin@replyflow.co.in").toLowerCase().trim();
  const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || "admin_replyflow_2026";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  console.log(`Setting up Admin account: ${adminEmail}...`);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      name: "ReplyFlow Administrator",
      role: "OWNER",
    },
    create: {
      email: adminEmail,
      passwordHash,
      name: "ReplyFlow Administrator",
      role: "OWNER",
    },
  });

  console.log(`✅ Administrator account ready: ${admin.email} (Role: ${admin.role})`);
  console.log("🚫 Zero dummy data created. Ready for clean production use.");
}

main()
  .catch((e) => {
    console.error("Error creating admin user:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

