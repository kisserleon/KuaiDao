import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetType = searchParams.get("targetType");
  const targetId = searchParams.get("targetId");

  if (!targetType || !targetId) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const reviews = await prisma.review.findMany({
    where: { targetType, targetId },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { targetType, targetId, rating, comment } = await req.json();

  if (!targetType || !targetId || !rating || !comment) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const userId = (session.user as { id?: string }).id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const review = await prisma.review.create({
    data: {
      targetType,
      targetId,
      rating: Math.min(5, Math.max(1, Number(rating))),
      comment,
      userId,
    },
    include: { user: { select: { name: true } } },
  });

  return NextResponse.json(review, { status: 201 });
}
