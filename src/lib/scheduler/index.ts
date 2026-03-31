import cron, { type ScheduledTask } from "node-cron";
import { loadConfig } from "../fetchers/config";
import { fetchFromOverpass } from "../fetchers/overpass";
import { fetchFromDuckDuckGo } from "../fetchers/duckduckgo";
import { fetchFromGoogle } from "../fetchers/google";
import { fetchFromRedNote } from "../fetchers/rednote";

let googleTask: ScheduledTask | null = null;
let rednoteTask: ScheduledTask | null = null;

export function startScheduler() {
  stopScheduler();
  const config = loadConfig();

  if (!config.schedule.enabled) {
    console.log("[Scheduler] Disabled via config");
    return;
  }

  const { google, rednote } = config.sources;

  if (google.enabled) {
    const cronExpr = google.schedule || config.schedule.cron;
    console.log(`[Scheduler] Business fetch scheduled: ${cronExpr}`);

    googleTask = cron.schedule(
      cronExpr,
      async () => {
        console.log(`[Scheduler] Running business fetch at ${new Date().toISOString()}`);
        try {
          // Use Overpass (free) first, then Google if key is available
          let count = await fetchFromOverpass();
          console.log(`[Scheduler] Overpass fetch: ${count} listings`);

          if (process.env.GOOGLE_PLACES_API_KEY) {
            const gCount = await fetchFromGoogle();
            count += gCount;
            console.log(`[Scheduler] Google fetch: ${gCount} listings`);
          }

          console.log(`[Scheduler] Business fetch complete: ${count} total listings`);
        } catch (err) {
          console.error("[Scheduler] Business fetch failed:", err);
        }
      },
      { timezone: config.schedule.timezone }
    );
  }

  if (rednote.enabled) {
    const cronExpr = rednote.schedule || config.schedule.cron;
    console.log(`[Scheduler] RedNote fetch scheduled: ${cronExpr}`);

    rednoteTask = cron.schedule(
      cronExpr,
      async () => {
        console.log(`[Scheduler] Running RedNote fetch at ${new Date().toISOString()}`);
        try {
          // Use DuckDuckGo (free) first, then Google CSE if configured
          let count = await fetchFromDuckDuckGo();
          console.log(`[Scheduler] DuckDuckGo fetch: ${count} listings`);

          if (process.env.GOOGLE_SEARCH_API_KEY) {
            const gCount = await fetchFromRedNote();
            count += gCount;
            console.log(`[Scheduler] Google CSE fetch: ${gCount} listings`);
          }

          console.log(`[Scheduler] RedNote fetch complete: ${count} total listings`);
        } catch (err) {
          console.error("[Scheduler] RedNote fetch failed:", err);
        }
      },
      { timezone: config.schedule.timezone }
    );
  }

  console.log("[Scheduler] Started successfully");
}

export function stopScheduler() {
  if (googleTask) {
    googleTask.stop();
    googleTask = null;
  }
  if (rednoteTask) {
    rednoteTask.stop();
    rednoteTask = null;
  }
}

export function getSchedulerStatus() {
  const config = loadConfig();
  return {
    enabled: config.schedule.enabled,
    google: {
      enabled: config.sources.google.enabled,
      schedule: config.sources.google.schedule,
      running: !!googleTask,
    },
    rednote: {
      enabled: config.sources.rednote.enabled,
      schedule: config.sources.rednote.schedule,
      running: !!rednoteTask,
    },
    timezone: config.schedule.timezone,
    location: config.location,
  };
}
