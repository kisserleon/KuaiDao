import fs from "fs";
import path from "path";

export interface FetchConfig {
  location: {
    city: string;
    country: string;
    lat: number;
    lng: number;
    radiusMeters: number;
  };
  schedule: {
    enabled: boolean;
    cron: string;
    timezone: string;
  };
  sources: {
    google: {
      enabled: boolean;
      schedule: string;
      queries: Record<string, string[]>;
      maxResultsPerQuery: number;
    };
    rednote: {
      enabled: boolean;
      schedule: string;
      queries: string[];
      maxResultsPerQuery: number;
    };
  };
  autoApprove: boolean;
  notifyOnFetch: boolean;
}

const CONFIG_PATH = path.resolve(process.cwd(), "config/fetch-config.json");

let cachedConfig: FetchConfig | null = null;
let configMtime = 0;

export function loadConfig(): FetchConfig {
  const stat = fs.statSync(CONFIG_PATH);
  if (cachedConfig && stat.mtimeMs === configMtime) return cachedConfig;

  const raw = fs.readFileSync(CONFIG_PATH, "utf-8");
  cachedConfig = JSON.parse(raw) as FetchConfig;
  configMtime = stat.mtimeMs;
  return cachedConfig;
}

export function updateConfig(updates: Partial<FetchConfig>): FetchConfig {
  const config = loadConfig();
  const merged = { ...config, ...updates };
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(merged, null, 2));
  cachedConfig = merged;
  return merged;
}
