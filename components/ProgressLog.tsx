"use client";
import React, { useEffect, useState } from "react";
import { getLogs } from "../utils/storage";

export default function ProgressLog({ refreshTrigger }: { refreshTrigger: number }) {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    setLogs(getLogs());
  }, [refreshTrigger]);

  if (!logs.length) return <div className="bg-zinc-800 p-4 rounded-lg">No progress logged yet.</div>;

  return (
    <div className="bg-zinc-800 p-4 rounded-lg w-full">
      <h3 className="font-semibold text-violet-400 text-lg mb-2">Recent Progress</h3>
      <ul className="space-y-2">
        {logs.slice(0, 5).map((entry, i) => (
          <li key={i} className="border-b border-zinc-700 pb-2">
            <div className="text-sm text-zinc-300">{entry.date}</div>
            <div className="text-xs text-zinc-400">Mood: {entry.mood} | Weight: {entry.weight}</div>
            <div className="text-xs text-zinc-400">Workout done: {entry.workoutDone ? "Yes" : "No"}</div>
            <div className="text-xs text-zinc-400">Meals complete: {entry.mealsComplete || 0}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
