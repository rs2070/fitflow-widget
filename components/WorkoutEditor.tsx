"use client";
import React, { useState } from "react";
import { saveSettings, loadSettings } from "../utils/storage";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function WorkoutEditor({ open, onClose }: { open: boolean, onClose: () => void }) {
  if (!open) return null;
  const existing = loadSettings()?.weeklyWorkouts || {};
  const [plan, setPlan] = useState<{ [day: string]: string }>({ ...existing });

  function handleChange(day: string, value: string) {
    setPlan(p => ({ ...p, [day]: value }));
  }

  function handleSave() {
    const settings = loadSettings() || {};
    settings.weeklyWorkouts = plan;
    saveSettings(settings);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        className="backdrop-blur-xl bg-white/30 dark:bg-zinc-900/100 p-4 sm:p-8 rounded-2xl w-[98vw] max-w-xl shadow-2xl border border-white/30"
        style={{
          boxShadow: "0 8px 32px 0 rgba(31,38,135,0.15)",
          border: "1.5px solid rgba(255,255,255,0.18)"
        }}
      >
        <h3 className="text-white text-xl mb-4 text-center">Edit Weekly Workout Plan</h3>
        <div className="space-y-2">
          {DAYS.map(day => (
            <div key={day}>
              <label className="text-white">{day}</label>
              <textarea
                className="w-full rounded bg-zinc-600 border-none p-2 mt-1 text-sm"
                value={plan[day] || ""}
                rows={2}
                placeholder="e.g. 4x10 bench press, 3x8 deadlift, etc."
                onChange={e => handleChange(day, e.target.value)}
              />
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mt-6">
          <button onClick={handleSave} className="flex-1 py-2 bg-lime-400 rounded font-bold">
            Save Plan
          </button>
          <button onClick={onClose} className="flex-1 py-2 bg-zinc-700 rounded text-white">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );  
}
