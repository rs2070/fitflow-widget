"use client";
import React, { useState, useEffect } from "react";
import { saveSettings, loadSettings } from "../utils/storage";

const DEFAULTS = {
  mealsPerDay: 3,
  calorieGoal: 2200,
  workoutType: "full_body",
  allergies: "",
  groceries: "",
};

type Settings = typeof DEFAULTS;

export default function Onboarding({
  open,
  onComplete,
}: {
  open: boolean;
  onComplete: () => void;
}) {
  const [values, setValues] = useState<Settings>(DEFAULTS);

  // When modal is shown, reload settings
  useEffect(() => {
    if (open) {
      const settings = loadSettings() || DEFAULTS;
      setValues(settings);
    }
  }, [open]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setValues((v: Settings) => ({ ...v, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    saveSettings(values);
    onComplete();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        className="backdrop-blur-xl bg-white/30 dark:bg-zinc-900/95 p-8 rounded-2xl w-[92vw] max-w-md scale-75 mb-160 shadow-2xl border border-white/30"
        style={{
          boxShadow: "0 8px 32px 0 rgba(31,38,135,0.15)",
          border: "1.5px solid rgba(255,255,255,0.18)",
        }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-lime-300 drop-shadow">
          Welcome to FitFlow
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-zinc-200">Meals per day:</label>
            <input
              name="mealsPerDay"
              type="number"
              value={values.mealsPerDay}
              onChange={handleChange}
              min={1}
              max={6}
              className="w-full rounded bg-zinc-700 border-none p-2 text-white placeholder:text-zinc-400"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-zinc-200">Daily Calorie Goal:</label>
            <input
              name="calorieGoal"
              type="number"
              value={values.calorieGoal}
              onChange={handleChange}
              min={1000}
              max={6000}
              className="w-full rounded bg-zinc-700 border-none p-2 text-white placeholder:text-zinc-400"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-zinc-200">Workout Type:</label>
            <select
              name="workoutType"
              value={values.workoutType}
              onChange={handleChange}
              className="w-full rounded bg-zinc-700 border-none p-2 text-white"
            >
              <option value="full_body">Full Body</option>
              <option value="powerlifting">Powerlifting</option>
              <option value="bodybuilding">Bodybuilding</option>
              <option value="cardio">Cardio/HIIT</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 text-zinc-200">
              Food allergies or restricted foods (comma separated):
            </label>
            <input
              name="allergies"
              type="text"
              value={values.allergies}
              onChange={handleChange}
              placeholder="e.g. peanuts, dairy"
              className="w-full rounded bg-zinc-700 border-none p-2 text-white placeholder:text-zinc-400"
            />
          </div>
          <div>
            <label className="block mb-1 text-zinc-200">
              Groceries you have (comma separated):
            </label>
            <input
              name="groceries"
              type="text"
              value={values.groceries}
              onChange={handleChange}
              placeholder="e.g. eggs, chicken, rice"
              className="w-full rounded bg-zinc-700 border-none p-2 text-white placeholder:text-zinc-400"
            />
          </div>
          <button
            type="submit"
            className="mt-4 w-full py-2 rounded-lg bg-gradient-to-r from-lime-400 to-green-500 text-black font-bold hover:scale-105 transition"
          >
            Save & Start
          </button>
        </form>
      </div>
    </div>
  );
}
