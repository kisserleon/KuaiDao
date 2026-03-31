import { NextRequest, NextResponse } from "next/server";
import { fetchFromGoogle } from "@/lib/fetchers/google";
import { fetchFromRedNote } from "@/lib/fetchers/rednote";

// POST /api/fetch — trigger a manual fetch
export async function POST(req: NextRequest) {
  const { source, type } = await req.json().catch(() => ({ source: "all", type: undefined }));

  const results: Record<string, number> = {};

  if (source === "all" || source === "google") {
    results.google = await fetchFromGoogle(type);
  }
  if (source === "all" || source === "rednote") {
    results.rednote = await fetchFromRedNote();
  }

  return NextResponse.json({
    ok: true,
    results,
    fetchedAt: new Date().toISOString(),
  });
}
