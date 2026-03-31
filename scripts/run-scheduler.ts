#!/usr/bin/env node

/**
 * Standalone scheduler runner.
 * Run with: npx tsx scripts/run-scheduler.ts
 * Or via pm2: pm2 start npx --name kuaidao-fetcher -- tsx scripts/run-scheduler.ts
 *
 * Flags:
 *   --now              Run fetch immediately before starting scheduler
 *   --source=google    Only fetch from Google (default: all)
 *   --source=rednote   Only fetch from RedNote
 *   --schedule         Keep running as scheduler after --now fetch
 */

import { startScheduler, getSchedulerStatus } from "../src/lib/scheduler";
import { fetchFromOverpass } from "../src/lib/fetchers/overpass";
import { fetchFromDuckDuckGo } from "../src/lib/fetchers/duckduckgo";
import { fetchFromGoogle } from "../src/lib/fetchers/google";
import { fetchFromRedNote } from "../src/lib/fetchers/rednote";

const args = process.argv.slice(2);

async function main() {
  if (args.includes("--now")) {
    console.log("=== Running immediate fetch ===");
    const source = args.find((a) => a.startsWith("--source="))?.split("=")[1] || "free";

    if (source === "free" || source === "all" || source === "overpass") {
      console.log("\n--- OpenStreetMap (Overpass) ---");
      const count = await fetchFromOverpass();
      console.log(`Overpass: ${count} listings fetched`);
    }

    if (source === "free" || source === "all" || source === "duckduckgo") {
      console.log("\n--- DuckDuckGo (RedNote) ---");
      const count = await fetchFromDuckDuckGo();
      console.log(`DuckDuckGo: ${count} listings fetched`);
    }

    if (source === "all" || source === "google") {
      console.log("\n--- Google Places ---");
      const count = await fetchFromGoogle();
      console.log(`Google: ${count} listings fetched`);
    }

    if (source === "all" || source === "rednote") {
      console.log("\n--- RedNote (Google CSE) ---");
      const count = await fetchFromRedNote();
      console.log(`RedNote: ${count} listings fetched`);
    }

    console.log("\n=== Fetch complete ===");

    if (!args.includes("--schedule")) {
      process.exit(0);
    }
  }

  console.log("Starting scheduler...");
  startScheduler();

  const status = getSchedulerStatus();
  console.log("Scheduler status:", JSON.stringify(status, null, 2));
  console.log("\nScheduler running. Press Ctrl+C to stop.");

  process.on("SIGINT", () => {
    console.log("\nStopping scheduler...");
    process.exit(0);
  });
}

main().catch((err) => {
  console.error("Scheduler error:", err);
  process.exit(1);
});
