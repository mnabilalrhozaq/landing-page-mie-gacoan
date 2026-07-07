import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

export async function GET() {
  const prisma = new PrismaClient();
  try {
    // 1. Update/create admin password to nabilar123
    const hashedPassword = await bcrypt.hash('nabilar123', 10);
    const admin = await prisma.admin.upsert({
      where: { email: 'admin@miegacoan.com' },
      update: { password: hashedPassword },
      create: {
        name: 'Admin Mie Gacoan',
        email: 'admin@miegacoan.com',
        password: hashedPassword,
      },
    });

    // 2. Check if HeroSlides are empty, if so seed them
    const slidesCount = await prisma.heroSlide.count();
    let seededSlides: any[] = [];
    if (slidesCount === 0) {
      seededSlides = await Promise.all([
        prisma.heroSlide.create({
          data: {
            image: '/uploads/hero/1782586409015-gallery_1777785553_5898.jpeg',
            order: 1,
            isActive: true,
          }
        }),
        prisma.heroSlide.create({
          data: {
            image: '/uploads/hero/1782586425778-Miri-Landing--1536x764.jpg',
            order: 2,
            isActive: true,
          }
        }),
      ]);
    }

    return NextResponse.json({
      success: true,
      message: "Database setup completed successfully!",
      admin: { email: admin.email, name: admin.name },
      slidesCountBefore: slidesCount,
      seededSlides
    });
  } catch (error: any) {
    console.error("Setup route error:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Unknown error occurred"
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
