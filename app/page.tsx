// /app/page.tsx (or /pages/index.tsx)

"use client";
import React, { useState, useEffect } from "react";
import Onboarding from "../components/Onboarding";
import Dashboard from "../components/Dashboard";
import { loadSettings } from "../utils/storage";
import Widget from "../components/Widget";

export default function Home() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    setShowOnboarding(!loadSettings());
  }, []);

  function handleOnboardingComplete() {
    setShowOnboarding(false);
  }

  function handleReset() {
    localStorage.clear();
    setShowOnboarding(true);
  }

  return (
  <main className="min-h-screen w-full bg-gradient-to-br from-fuchsia-900/90 via-pink-700/50 to-indigo-900/80 backdrop-blur-[6px]">
    <Widget />
  </main>
  );
}
