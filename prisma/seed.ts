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
    { targetType: "restaurant", targetId: "1", rating: 5, comment: "正宗四川味道，在都柏林能吃到这么地道的川菜太难得了！干辣鸡和蒜汁鸡都强烈推荐。" },
    { targetType: "restaurant", targetId: "1", rating: 4, comment: "Authentic Sichuan — way beyond your average Chinese takeaway. Bold flavours and decent portions." },
    { targetType: "restaurant", targetId: "2", rating: 5, comment: "嘉升的点心非常正宗，虾饺和凤爪都很好吃！在都柏林吃点心首选。" },
    { targetType: "restaurant", targetId: "3", rating: 4, comment: "Hang Dai的苹果木烤鸭太棒了，氛围很好，适合约会和朋友聚会。鸡尾酒也很有创意。" },
    { targetType: "grocery", targetId: "1", rating: 4, comment: "Drury Street的亚洲超市种类齐全，调料和零食都能找到，是都柏林买中国食材的首选。" },
    { targetType: "grocery", targetId: "3", rating: 4, comment: "Oriental Pantry在Moore Street，生鲜和冷冻食品选择丰富，价格也合理。" },
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
