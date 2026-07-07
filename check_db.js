const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("=== ADMIN ===");
  console.log(await prisma.admin.findMany());
  console.log("=== HERO SLIDES ===");
  console.log(await prisma.heroSlide.findMany());
  console.log("=== MENU ===");
  console.log(await prisma.menu.findMany({ select: { id: true, name: true, image: true, isActive: true } }));
  console.log("=== PACKAGE ===");
  console.log(await prisma.package.findMany({ select: { id: true, name: true, image: true, isActive: true } }));
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
