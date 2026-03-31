import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create demo user
  const password = await bcrypt.hash("demo123", 12);
  const user = await prisma.user.upsert({
    where: { email: "demo@kuaidao.app" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@kuaidao.app",
      password,
    },
  });

  // Create sample reviews
  const reviews = [
    { targetType: "restaurant", targetId: "1", rating: 5, comment: "正宗四川味道，麻辣过瘾！强烈推荐水煮鱼和宫保鸡丁。" },
    { targetType: "restaurant", targetId: "1", rating: 4, comment: "味道不错，服务很好。就是等位时间有点长。" },
    { targetType: "restaurant", targetId: "2", rating: 5, comment: "早茶非常地道，虾饺和凤爪都很好吃！" },
    { targetType: "restaurant", targetId: "4", rating: 4, comment: "火锅食材新鲜，锅底选择多。朋友聚会好去处。" },
    { targetType: "grocery", targetId: "1", rating: 4, comment: "大华超市种类齐全，烧腊很赞。" },
    { targetType: "grocery", targetId: "3", rating: 5, comment: "宇和島屋环境最好的亚洲超市，还有书店和礼品店。" },
  ];

  for (const r of reviews) {
    await prisma.review.create({
      data: { ...r, userId: user.id },
    });
  }

  console.log("✅ Seed completed: 1 user + 6 reviews");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
