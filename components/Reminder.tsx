"use client";
import React, { useState, useEffect } from "react";

// Simple toast for notifications
function showToast(msg: string) {
    // Native Notification if possible
    if ("Notification" in window && Notification.permission === "granted") {
      try {
        new window.Notification("FitFlow Reminder", {
          body: msg,
          icon: "/favicon.ico",
          tag: "fitflow-reminder",
        });
      } catch {}
    }
    // In-app fallback (top center, white bubble, blue text)
    const id = "fitflow-toast";
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement("div");
      el.id = id;
      document.body.appendChild(el);
    }
    el.innerText = `🚨 REMINDER 🚨 -> ${msg}`;
    el.style.cssText = `
      position: fixed;
      top: 30px; left: 50%; transform: translateX(-50%);
      z-index: 9999;
      background: #fff;
      color: #2563eb; /* Tailwind blue-600 */
      border: 1.5px solid #3b82f6;
      padding: 12px 28px; border-radius: 18px;
      font-size: 1rem; font-weight: 700; letter-spacing: 0.01em;
      box-shadow: 0 8px 28px 0 rgba(30, 58, 138, 0.09);
      opacity: 0.97;
      transition: opacity 0.22s;
      text-align: center;
      pointer-events: none;
    `;
    // Play sound
    const audio = new Audio("https://notificationsounds.com/storage/sounds/file-sounds-1150-pristine.mp3");
    audio.play();
    setTimeout(() => { el && (el.style.opacity = "0"); }, 8000);
    setTimeout(() => { el && el.remove(); }, 85000);
  
    // ---- CHANGE PAGE TITLE HERE ----
    const prevTitle = document.title;
    document.title = "🔔 New Notification!";
    setTimeout(() => {
      document.title = prevTitle;
    }, 10000);
  }  

// Time helper
function getCurrentHHMM() {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, "0");
  const m = now.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}

export default function Reminder() {
  const [reminders, setReminders] = useState<{ time: string; message: string }[]>([]);
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  const [notifStatus, setNotifStatus] = useState<NotificationPermission>(
    typeof window !== "undefined" && "Notification" in window
      ? Notification.permission
      : "default"
  );
  const [error, setError] = useState<string | null>(null);

  // Request permission on mount (for native notifications)
  useEffect(() => {
    if ("Notification" in window) {
      setNotifStatus(Notification.permission);
      if (Notification.permission === "default") {
        Notification.requestPermission().then((status) => {
          setNotifStatus(status);
        });
      }
    }
  }, []);

  // Check reminders
  useEffect(() => {
    const interval = setInterval(() => {
      const current = getCurrentHHMM();
      setReminders((remList) => {
        const remaining: typeof remList = [];
        remList.forEach((rem) => {
          if (rem.time === current) {
            showToast(rem.message); // <-- Always shows in-app, plays sound
          } else {
            remaining.push(rem);
          }
        });
        return remaining;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  function addReminder() {
    if (!time || !message.trim()) {
      setError("Enter both time and message");
      return;
    }
    setReminders((list) => [
      ...list,
      { time, message: message.trim() },
    ]);
    setTime("");
    setMessage("");
    setError(null);
  }

  function clearReminders() {
    const audio = new Audio("https://notificationsounds.com/storage/sounds/file-sounds-1150-pristine.mp3");
    audio.play();
    setReminders([]);
  }

  return (
    <div className="rounded-2xl bg-blue-900/90 p-4 shadow w-full min-w-[200px] max-w-xs space-y-3">
      <div className="text-blue-200 font-semibold text-md mb-1">Reminder</div>
      <div className="flex flex-col gap-2 w-full">
        {/* Make each input its own row */}
        <div className="flex flex-row w-full">
            <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="bg-blue-100 text-blue-900 rounded px-1.5 py-1 w-[200px] text-xs font-medium "
            />
        </div>
        <div className="flex flex-row w-full">
            <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your reminder..."
            className="bg-blue-100 text-blue-900 rounded px-2 py-1 flex-1 text-xs min-w-[120px]"
            maxLength={45}
            onKeyDown={(e) => {
                if (e.key === "Enter") addReminder();
            }}
            />
        </div>
        <div className="flex flex-row gap-1 w-full">
            <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded px-3 py-1 text-xs"
            onClick={addReminder}
            >
            Add
            </button>
            <button
            className="bg-blue-700 hover:bg-blue-800 text-white font-bold rounded px-2.5 py-1 text-xs"
            onClick={clearReminders}
            title="Clear all reminders"
            >
            ×
            </button>
        </div>
        </div>
      {error && (
        <div className="text-xs text-yellow-400 font-semibold">{error}</div>
      )}
      {notifStatus !== "granted" && (
        <div className="text-xs text-yellow-400 mt-1">
          <b>Enable browser notifications</b> for reminders!
        </div>
      )}
      <div className="text-xs text-blue-200 mt-1">
        {reminders.length === 0
          ? <span className="italic opacity-70">No reminders set.</span>
          : (
            <ul className="space-y-1">
              {reminders.map((r, i) => (
                <li key={i} className="flex gap-2 items-center">
                  <span className="font-mono bg-blue-800/50 rounded px-1">
                    {r.time}
                  </span>
                  <span>{r.message}</span>
                </li>
              ))}
            </ul>
          )}
      </div>
    </div>
  );
}
