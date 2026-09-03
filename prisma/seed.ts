import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "director@example.com";
  const password = process.env.ADMIN_PASSWORD || "changeme123";
  const hash = await bcrypt.hash(password, 10);

  // Admin
  await prisma.admin.upsert({
    where: { email },
    update: { passwordHash: hash },
    create: { email, passwordHash: hash, name: "Arjun Menon" },
  });

  // Settings
  await prisma.siteSettings.create({
    data: {
      siteName: "Arjun Menon",
      tagline: "Exploring the human condition through cinema and literature.",
      heroSubtitle: "Filmmaker · Novelist",
      contactEmail: "hello@example.com",
    },
  });

  // Works
  await prisma.work.createMany({
    data: [
      { title: "The Last Horizon", slug: "the-last-horizon", year: 2024, role: "Director, Writer", genre: "Sci-Fi / Drama", status: "published", featured: true },
      { title: "Neon Nights", slug: "neon-nights", year: 2022, role: "Director", genre: "Neo-Noir / Thriller", status: "published", featured: true },
    ]
  });

  // InDev
  await prisma.inDevProject.create({
    data: { title: "Echoes of the Past", slug: "echoes", devStatus: "Pre-Production", genre: "Historical Drama", status: "published" }
  });

  // Novels
  await prisma.novel.create({
    data: { title: "A Symphony of Shadows", slug: "symphony", genre: "Literary Fiction", pubStatus: "Published", status: "published", featured: true }
  });

  console.log("Seed completed!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
