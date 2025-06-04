const SETTINGS_KEY = "fitflow_settings";
const LOGS_KEY = "fitflow_logs";
const PROGRESS_KEY = "fitflow_progress";

export function saveSettings(settings: any) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
export function loadSettings() {
  if (typeof window === 'undefined') return null;
  return JSON.parse(localStorage.getItem(SETTINGS_KEY) || "null");
}

export function logDay(entry: any) {
  let logs = JSON.parse(localStorage.getItem(LOGS_KEY) || "[]");
  logs.unshift(entry);
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
}

export function getLogs() {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem(LOGS_KEY) || "[]");
}

export function saveProgress(date: string, progress: any) {
  let all = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
  all[date] = progress;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(all));
}
export function getProgress(date: string) {
  if (typeof window === 'undefined') return null;
  let all = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
  return all[date] || null;
}
