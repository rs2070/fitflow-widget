"use client";
import React, { useEffect, useState } from "react";
import { fetchWorkout, fetchGeminiWorkout } from "../utils/api";
import { loadSettings } from "../utils/storage";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function WorkoutPlan() {
  // Only call loadSettings ONCE when component mounts!
  const [settings] = useState(() => loadSettings());
  const todayIdx = new Date().getDay();
  const weeklyWorkouts = settings?.weeklyWorkouts || {};
  const customStr = (weeklyWorkouts[DAYS[todayIdx]] ?? "").trim();
  const hasCustom = !!customStr;

  const [customExercises, setCustomExercises] = useState<string[]>([]);
  const [workout, setWorkout] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [geminiDropdown, setGeminiDropdown] = useState("push");
  const [geminiResult, setGeminiResult] = useState<string[] | null>(null);
  const [geminiLoading, setGeminiLoading] = useState(false);

  // This effect will only run if customStr or hasCustom changes (which they only will if user saves a new workout)
  useEffect(() => {
    if (hasCustom) {
      const items = customStr
        .split(/,|\n/)
        .map((x: string) => x.trim())
        .filter(Boolean);
      setCustomExercises(items);
    } else {
      setCustomExercises([]);
    }
  }, [customStr, hasCustom]);

  // Only fetch workout if not custom
  useEffect(() => {
    if (!hasCustom) {
      setLoading(true);
      fetchWorkout(settings?.workoutType)
        .then(setWorkout)
        .finally(() => setLoading(false));
    }
  }, [settings, hasCustom]);

  // Gemini AI recommendation handler
  async function handleGeminiRecommend() {
    setGeminiLoading(true);
    setGeminiResult(null);
    const resp = await fetchGeminiWorkout(geminiDropdown);
    console.log("Gemini response for", geminiDropdown, ":", resp); // DEBUG
    setGeminiResult(resp);
    setGeminiLoading(false);
  }  

  return (
    <div className="bg-zinc-800 p-4 rounded-lg flex flex-col items-start gap-2 w-full min-h-[230px]" >
      <h3 className="font-semibold text-pink-400 text-lg mb-2">Today's Workout</h3>
      {hasCustom ? (
        <>
          <div className="text-white font-bold text-xl mb-1">Your Custom Workout ({DAYS[todayIdx]})</div>
          <ul className="list-disc pl-6">
            {customExercises.map((item, idx) => (
              <li key={idx} className="text-zinc-300">{item}</li>
            ))}
          </ul>
        </>
      ) : loading ? (
        <div>Loading workout...</div>
      ) : workout ? (
        <>
          <div className="text-white font-bold text-xl mb-1">Exercise Plan</div>
          <div className="text-sm text-zinc-300 mb-1">
            <strong>Duration:</strong> {workout.duration} minutes
          </div>
          <div className="text-sm text-zinc-300">
            <strong>Exercises:</strong>
            <ul className="list-disc pl-6">
              {workout.exercises.map((ex: any, i: number) => (
                <li key={i}>
                  {ex.name} — {ex.sets}x{ex.reps}
                </li>
              ))}
            </ul>
          </div>
          <div className="text-xs text-zinc-400 mt-2">
            Muscle groups: {workout.muscleGroups.join(", ")}
          </div>
        </>
      ) : (
        <div>Unable to load workout.</div>
      )}
      {/* Gemini Recommendation UI */}
      <div className="w-full mt-4">
        <label className="block text-sm mb-2 text-zinc-400">
          Recommend me a workout for today:
        </label>
        <div className="flex gap-2">
          <select
            value={geminiDropdown}
            onChange={e => setGeminiDropdown(e.target.value)}
            className="rounded bg-zinc-900 border-none px-2 py-1 text-white"
          >
            <option value="push">Push</option>
            <option value="pull">Pull</option>
            <option value="legs">Legs</option>
            <option value="core">Core</option>
          </select>
          <button
            className="bg-cyan-400 text-black rounded px-3 py-1 font-bold"
            onClick={handleGeminiRecommend}
            disabled={geminiLoading}
          >
            {geminiLoading ? "Loading..." : "Recommend"}
          </button>
        </div>
        {geminiResult && (
          <ul className="list-disc pl-6 mt-2">
            {geminiResult.map((line, idx) => (
              <li key={idx} className="text-cyan-200">{line}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
