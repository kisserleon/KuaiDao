import { NextRequest, NextResponse } from "next/server";
import { fetchFromOverpass } from "@/lib/fetchers/overpass";
import { fetchFromDuckDuckGo } from "@/lib/fetchers/duckduckgo";
import { fetchFromGoogle } from "@/lib/fetchers/google";
import { fetchFromRedNote } from "@/lib/fetchers/rednote";

// POST /api/fetch — trigger a manual fetch
// body: { source: "overpass"|"duckduckgo"|"google"|"rednote"|"all"|"free", type?: string }
export async function POST(req: NextRequest) {
  const { source = "free", type } = await req.json().catch(() => ({ source: "free", type: undefined }));

  const results: Record<string, number> = {};

  if (source === "all" || source === "free" || source === "overpass") {
    results.overpass = await fetchFromOverpass(type);
  }
  if (source === "all" || source === "free" || source === "duckduckgo") {
    results.duckduckgo = await fetchFromDuckDuckGo();
  }
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
