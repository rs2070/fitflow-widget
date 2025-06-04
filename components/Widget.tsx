"use client";
import React, { useState, useMemo } from "react";
import { motion, useDragControls, AnimatePresence } from "framer-motion";
import {
  Soup, Dumbbell, Smile, BarChart2, Sparkles,
  ChevronDown, ChevronUp, Move
} from "lucide-react";
import Dashboard from "./Dashboard";
import { getLogs } from "../utils/storage";

export default function Widget() {
  const [expanded, setExpanded] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const dragControls = useDragControls();

  // Compute workout count (memoized for perf)
  const totalWorkoutsDone = useMemo(() => {
    try {
      const logs = getLogs();
      return logs.filter((log: any) => log.workoutDone).length;
    } catch {
      return 0;
    }
  }, []); 

  const ICONS = [
    {
      icon: Soup,
      color: "text-lime-400",
      label: "Meal",
      summary: "Try today’s meal suggestion!",
    },
    {
      icon: Dumbbell,
      color: "text-pink-400",
      label: "Workout",
      summary: "Full body up next",
    },
    {
      icon: Smile,
      color: "text-cyan-400",
      label: "Check-in",
      summary: "Mood not logged",
    },
    {
      icon: BarChart2,
      color: "text-violet-400",
      label: "Progress",
      summary: `Total workouts done: ${totalWorkoutsDone}`,
    },
    {
      icon: Sparkles,
      color: "text-yellow-400",
      label: "Motivation",
      summary: "Get inspired today!",
    },
  ];

  // Sizing for widgets
  const widgetWidth = expanded
    ? "w-[40vw] max-w-xl min-w-[340px]"
    : "w-[490px] h-[60px]";
  const widgetHeight = expanded ? "min-h-[420px]" : "h-[60px]";

  return (
    <motion.div
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      dragTransition={{ power: 0.08, timeConstant: 90, restDelta: 0.5 }}
      className={`
        fixed z-50 left-0 top-8
        w-full max-w-xl min-w-[90vw] sm:min-w-[340px]
        rounded-3xl shadow-2xl
        bg-white/30 dark:bg-zinc-900/80
        backdrop-blur-xl border border-white/40 dark:border-zinc-800/60
        transition-all duration-300
        cursor-default select-none
        px-2
      `}
      style={{
        fontFamily: "var(--font-geist-sans), Inter, Arial, Helvetica, sans-serif",
        background: "linear-gradient(135deg, rgba(255,255,255,0.19) 0%, rgba(120,139,255,0.08) 100%)"
      }}
    >
      <div className="flex items-center px-2 pt-2 gap-2 flex-wrap">
        <button
          className="p-1.5 rounded-full hover:bg-zinc-700 bg-transparent cursor-grab active:cursor-grabbing"
          style={{ marginRight: 8 }}
          title="Move widget"
          onPointerDown={(e) => dragControls.start(e)}
        >
          <Move size={18} className="text-zinc-500" />
        </button>
        <div className="font-bold text-[15px] ml-1 mr-2 text-zinc-900 dark:text-white tracking-wide select-none">
          FitFlow
        </div>
        {/* Colored Icons */}
        <div className="flex flex-row flex-wrap gap-4 ml-2">
          {ICONS.map(({ icon: Icon, color, label, summary }, idx) => (
            <div
              key={label}
              className={`relative rounded-full p-1.5 bg-white/30 dark:bg-zinc-800/80 shadow
                hover:scale-110 hover:bg-white/50 dark:hover:bg-zinc-700 transition-all
                ${color}`}
              title={label}
              style={{ marginLeft: idx === 0 ? 4 : 0 }}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <Icon size={19} />
              {/* Tooltip */}
              <AnimatePresence>
                {hoveredIdx === idx && (
                  <motion.div
                    key="tooltip"
                    initial={{ opacity: 0, y: -12, scale: 0.95 }}
                    animate={{ opacity: 1, y: -28, scale: 1 }}
                    exit={{ opacity: 0, y: -12, scale: 0.95 }}
                    transition={{ type: "spring", duration: 0.22 }}
                    className="absolute left-1/2 -translate-x-1/2 -top-2 z-50"
                  >
                    <div
                      className="px-3 py-1 rounded-xl shadow bg-gray-100/90 text-blue-700 font-semibold text-[11px] leading-tight min-w-[90px] text-center border border-blue-300"
                      style={{
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.09))",
                        letterSpacing: 0.02,
                      }}
                    >
                      {summary || "Loading..."}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
        {/* Collapse/expand arrow */}
        <motion.button
          whileHover={{ scale: 1.09, rotate: 90 }}
          whileTap={{ scale: 0.95 }}
          className="ml-auto rounded-full bg-white/60 dark:bg-zinc-700 p-1.5 shadow"
          style={{ marginRight: 2 }}
          onClick={() => setExpanded((v) => !v)}
          aria-label={expanded ? "Collapse" : "Expand"}
        >
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </motion.button>
      </div>
      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, scale: 0.96, y: 22 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 24 }}
            transition={{ type: "spring", duration: 0.25 }}
            className="p-2 md:p-3"
          >
            <DashboardWidget />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}  

// Dashboard in expanded view, fit inside widget 
function DashboardWidget() {
    return (
      <div className="w-full max-w-xl mx-auto max-h-[70vh] overflow-y-auto">
        <Dashboard onReset={() => {}} />
      </div>
    );
  }
  
