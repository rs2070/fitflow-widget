"use client";
import React, { useEffect, useState } from "react";
import { fetchMotivationalQuote } from "../utils/api";
import { getLogs } from "../utils/storage";

export default function Motivation({ refreshTrigger }: { refreshTrigger: number }) {
  const [quote, setQuote] = useState("Loading...");
  const [loading, setLoading] = useState(false);

  function getMostRecentMood() {
    const logs = getLogs();
    for (let i = 0; i < logs.length; ++i) {
      const log = logs[i];
      //console.log(log.mood);
      if (log.mood && log.mood.trim()) return log.mood.trim();
    }
    return "";
  }

  async function updateQuote() {
    setLoading(true);
    const mood = getMostRecentMood();
    //console.log("🚨 Sending most recent mood to Gemini:", mood);
    const q = await fetchMotivationalQuote(mood);
    setQuote(q);
    setLoading(false);
  }

  useEffect(() => {
    updateQuote();
  }, [refreshTrigger]); // <-- important: rerun when logRefresh changes

  return (
    <div className="bg-zinc-800 p-4 rounded-lg flex flex-col gap-2 w-full">
      <h3 className="font-semibold text-yellow-400 text-lg mb-2">Motivation</h3>
      <div className="text-sm text-zinc-200 italic">{quote}</div>
      <button
        onClick={updateQuote}
        disabled={loading}
        className="mt-2 px-2 py-1 rounded bg-yellow-400 text-black font-bold self-end"
      >
        {loading ? "Loading..." : "New Quote"}
      </button>
    </div>
  );
}
