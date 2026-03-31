import { NextRequest, NextResponse } from "next/server";
import { loadConfig, updateConfig } from "@/lib/fetchers/config";
import { startScheduler, stopScheduler } from "@/lib/scheduler";

// GET /api/fetch/config — get current config
export async function GET() {
  return NextResponse.json(loadConfig());
}

// PATCH /api/fetch/config — update config and restart scheduler
export async function PATCH(req: NextRequest) {
  const updates = await req.json();
  const config = updateConfig(updates);

  // Restart scheduler with new config
  if (config.schedule.enabled) {
    startScheduler();
  } else {
    stopScheduler();
  }

  return NextResponse.json({ ok: true, config });
}
