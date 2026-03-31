import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSchedulerStatus } from "@/lib/scheduler";

// GET /api/fetch/status — scheduler status + recent fetch logs
export async function GET() {
  const scheduler = getSchedulerStatus();

  const recentLogs = await prisma.fetchLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const listingCounts = await prisma.fetchedListing.groupBy({
    by: ["source", "type", "status"],
    _count: true,
  });

  return NextResponse.json({
    scheduler,
    recentLogs,
    listingCounts,
  });
}
