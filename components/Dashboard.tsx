"use client";
import React, { useState, useEffect } from "react";
import MealPlan from "./MealPlan";
import WorkoutPlan from "./WorkoutPlan";
import MoodLog from "./MoodLog";
import Motivation from "./Motivation";
import ProgressLog from "./ProgressLog";
import WorkoutEditor from "./WorkoutEditor";
import Onboarding from "./Onboarding";
import { loadSettings, logDay, getProgress } from "../utils/storage";
import { Settings, Plus } from "lucide-react";
import Reminder from "./Reminder";

export default function Dashboard({ onReset }: { onReset: () => void }) {
  // Add a refresh key for forcing re-mount after editor/settings save
  const [refreshKey, setRefreshKey] = useState(0);

  // When you want to "refresh" everything
  function handleReset() {
    setRefreshKey((k) => k + 1);
  }

  // Local UI states
  const [settings, setSettings] = useState(loadSettings());
  const [showSettings, setShowSettings] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [mealsComplete, setMealsComplete] = useState(0);
  const [workoutDone, setWorkoutDone] = useState(false);
  const [logRefresh, setLogRefresh] = useState(0);
  const [showWorkoutEditor, setShowWorkoutEditor] = useState(false);

  // Always reload settings when refreshKey changes
  useEffect(() => {
    setSettings(loadSettings());
  }, [refreshKey]);

  const maxMeals = settings?.mealsPerDay || 3;

  function completeMeal() {
    if (mealsComplete < maxMeals) setMealsComplete((c) => c + 1);
  }

  function completeWorkout() {
    setWorkoutDone(true);
  }

  function saveLog() {
    const progress = getProgress(today) || {};
    logDay({
      date: today,
      mood: progress.mood,
      weight: progress.weight,
      workoutDone,
      mealsComplete,
    });
    setLogRefresh((x) => x + 1);
  }

  // Updated: use handleReset to trigger UI refresh
  function handleWorkoutEditorClose() {
    setShowWorkoutEditor(false);
    handleReset();
  }

  function handleSettingsSaved() {
    setShowSettings(false);
    handleReset();
  }

  return (
    <div
      key={refreshKey}
      className="w-full max-w-lg mx-auto p-2 sm:p-3 md:p-4 bg-white/25 dark:bg-zinc-900/80 backdrop-blur-xl rounded-2xl shadow-2xl text-white space-y-4 transition-all duration-300"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.19) 0%, rgba(120,139,255,0.08) 100%)",
        boxShadow: "0 8px 32px 0 rgba(31,38,135,0.15)",
        border: "1.5px solid rgba(255,255,255,0.18)",
      }}
    >
      {/* Header with Logo, Title, and Settings */}
      <div className="flex justify-between items-center w-full">
        {/* Image */}
        <div className="flex items-center gap-2">
          {/* Logo image */}
          {/* <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-full shadow" /> */}
          <h2
            className="text-2xl font-bold"
            style={{
              color: "rgba(112, 11, 112, 0.97)",
              textShadow: ".1px .1px .2px white, 0 0 25px white, 0 0 .1px white",
            }}
          >
            Your FitFlow Dashboard
          </h2>
        </div>
        {/* Settings button */}
        <button
          onClick={() => setShowSettings(true)}
          className="bg-zinc-200 dark:bg-zinc-800 p-2 rounded-full hover:bg-zinc-700 shadow transition"
          title="Settings"
          style={{
            border: "1.5px solid #eee",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Settings size={22} className="text-zinc-700 dark:text-zinc-200" />
        </button>
        {showSettings && (
          <Onboarding open={showSettings} onComplete={handleSettingsSaved} />
        )}
      </div>
  
      {/* Add/WorkoutEditor Button */}
      <div className="flex justify-end mb-2">
        <button
          onClick={() => setShowWorkoutEditor(true)}
          className="bg-lime-500 rounded-full p-2 shadow hover:scale-105 transition"
          title="Edit custom workout plan"
          style={{
            border: "1.5px solid #b6f7a0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Plus size={22} className="text-black" />
        </button>
      </div>
      {/* WorkoutEditor modal */}
      <WorkoutEditor open={showWorkoutEditor} onClose={handleWorkoutEditorClose} />
  
      {/* Grid layout for main content */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <MealPlan />
        <WorkoutPlan />
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <MoodLog
          onSave={() => setLogRefresh((x) => x + 1)}
          mealsComplete={mealsComplete}
          workoutDone={workoutDone}
        />
        <ProgressLog refreshTrigger={logRefresh} />
        <Motivation refreshTrigger={0} />
        <Reminder />
      </div>
  
      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-4 justify-center">
        <button
          onClick={completeMeal}
          disabled={mealsComplete >= maxMeals}
          className={`bg-lime-400 text-black font-bold rounded px-3 py-2 hover:scale-105 ${
            mealsComplete >= maxMeals ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          Complete Meal ({mealsComplete}/{maxMeals})
        </button>
        <button
          onClick={completeWorkout}
          className={`bg-pink-400 text-black font-bold rounded px-3 py-2 hover:scale-105 ${
            workoutDone ? "opacity-60" : ""
          }`}
          disabled={workoutDone}
        >
          {workoutDone ? "Workout Done" : "Complete Workout"}
        </button>
        <button
          onClick={saveLog}
          className="bg-violet-400 text-black font-bold rounded px-3 py-2 hover:scale-105"
        >
          Save Progress
        </button>
      </div>
    </div>
  );  
}  