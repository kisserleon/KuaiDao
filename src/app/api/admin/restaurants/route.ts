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

  const [items, total] = await Promise.all([
    prisma.fetchedListing.findMany({
      where: { type: "restaurant" },
      orderBy: { fetchedAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.fetchedListing.count({ where: { type: "restaurant" } }),
  ]);

  return NextResponse.json({
    items,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if ("error" in auth)
    return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const body = await req.json();
    const {
      name,
      nameZh = "",
      description = "",
      address = "",
      city = "",
      phone = "",
      rating = 0,
      priceLevel = 0,
      lat = 0,
      lng = 0,
      categories = "",
      imageUrl = "",
      sourceUrl = "",
    } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const listing = await prisma.fetchedListing.create({
      data: {
        source: "manual",
        sourceId: `manual-${Date.now()}`,
        type: "restaurant",
        name,
        nameZh,
        description,
        address,
        city,
        phone,
        rating: Number(rating),
        priceLevel: Number(priceLevel),
        lat: Number(lat),
        lng: Number(lng),
        categories,
        imageUrl,
        sourceUrl,
        status: "approved",
      },
    });

    return NextResponse.json(listing, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
