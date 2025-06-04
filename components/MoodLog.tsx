"use client";
import React, { useState } from "react";
import { saveProgress, getProgress, logDay } from "../utils/storage";

export default function MoodLog({
  onSave,
  mealsComplete,
  workoutDone
}: {
  onSave: () => void,
  mealsComplete: number,
  workoutDone: boolean
}) {
  const today = new Date().toISOString().split("T")[0];
  const initial = getProgress(today) || { mood: "", weight: "" };
  const [mood, setMood] = useState(initial.mood || "");
  const [weight, setWeight] = useState(initial.weight || "");

  function handleSave() {
    const entry = {
      date: today,
      mood,
      weight,
      mealsComplete,        // Use the prop, not the stale initial!
      workoutDone,          // Use the prop!
    };
    saveProgress(today, entry);
    logDay(entry);
    onSave();
  }

  return (
    <div className="bg-zinc-800 p-4 rounded-lg flex flex-col gap-2 w-full">
      <h3 className="font-semibold text-cyan-400 text-lg mb-2">Today's Check-in</h3>
      <div>
        <label className="block mb-1">Mood:</label>
        <input
          type="text"
          value={mood}
          onChange={e => setMood(e.target.value)}
          className="w-full rounded bg-zinc-900 border-none p-2"
          placeholder="How are you feeling?"
        />
      </div>
      <div>
        <label className="block mb-1">Weight (optional):</label>
        <input
          type="number"
          value={weight}
          onChange={e => setWeight(e.target.value)}
          className="w-full rounded bg-zinc-900 border-none p-2"
          placeholder="lbs"
        />
      </div>
      <button
        onClick={handleSave}
        className="mt-2 py-1 rounded bg-cyan-400 text-black font-bold"
      >
        Save Check-in
      </button>
    </div>
  );
}
