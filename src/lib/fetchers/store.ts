import prisma from "@/lib/prisma";
import { loadConfig } from "./config";

interface FetchedItem {
  source: string;
  sourceId: string;
  type: string;
  name: string;
  nameZh?: string;
  description?: string;
  address?: string;
  city?: string;
  phone?: string;
  rating?: number;
  reviewCount?: number;
  priceLevel?: number;
  lat?: number;
  lng?: number;
  categories?: string;
  imageUrl?: string;
  sourceUrl?: string;
  rawData?: string;
}

export async function upsertListings(items: FetchedItem[]): Promise<number> {
  const config = loadConfig();
  let count = 0;

  for (const item of items) {
    await prisma.fetchedListing.upsert({
      where: {
        source_sourceId: { source: item.source, sourceId: item.sourceId },
      },
      create: {
        ...item,
        nameZh: item.nameZh || "",
        description: item.description || "",
        address: item.address || "",
        city: item.city || config.location.city,
        phone: item.phone || "",
        rating: item.rating || 0,
        reviewCount: item.reviewCount || 0,
        priceLevel: item.priceLevel || 0,
        lat: item.lat || 0,
        lng: item.lng || 0,
        categories: item.categories || "",
        imageUrl: item.imageUrl || "",
        sourceUrl: item.sourceUrl || "",
        rawData: item.rawData || "",
        status: config.autoApprove ? "approved" : "pending",
      },
      update: {
        name: item.name,
        nameZh: item.nameZh || undefined,
        description: item.description || undefined,
        address: item.address || undefined,
        phone: item.phone || undefined,
        rating: item.rating || undefined,
        reviewCount: item.reviewCount || undefined,
        lat: item.lat || undefined,
        lng: item.lng || undefined,
        categories: item.categories || undefined,
        imageUrl: item.imageUrl || undefined,
        rawData: item.rawData || undefined,
      },
    });
    count++;
  }

  return count;
}

export async function logFetch(
  source: string,
  type: string,
  status: string,
  count: number,
  message: string,
  duration: number
) {
  await prisma.fetchLog.create({
    data: { source, type, status, count, message, duration },
  });
}
