import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if ("error" in auth)
    return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || "20")));
  const skip = (page - 1) * limit;
  const status = searchParams.get("status");
  const source = searchParams.get("source");
  const type = searchParams.get("type");

  const where: Record<string, string> = {};
  if (status) where.status = status;
  if (source) where.source = source;
  if (type) where.type = type;

  const [items, total] = await Promise.all([
    prisma.fetchedListing.findMany({
      where,
      orderBy: { fetchedAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.fetchedListing.count({ where }),
  ]);

  return NextResponse.json({
    items,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin();
  if ("error" in auth)
    return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { ids, status } = await req.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "ids must be a non-empty array" }, { status: 400 });
    }
    if (!["approved", "rejected", "pending"].includes(status)) {
      return NextResponse.json(
        { error: "status must be approved, rejected, or pending" },
        { status: 400 },
      );
    }

    const result = await prisma.fetchedListing.updateMany({
      where: { id: { in: ids } },
      data: { status },
    });

    return NextResponse.json({ updated: result.count });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
