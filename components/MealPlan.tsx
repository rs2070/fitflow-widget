// /components/MealPlan.tsx

"use client";
import React, { useEffect, useState } from "react";
import { fetchRandomMeal } from "../utils/api";
import { loadSettings } from "../utils/storage";
import { fetchMealFromGroceries } from "../utils/api";

const settings = loadSettings();
const groceriesArr = settings?.groceries?.split(",").map((a: string) => a.trim()).filter(Boolean) || [];
const allergiesArr = settings?.allergies?.split(",").map((a: string) => a.trim()).filter(Boolean) || [];

export default function MealPlan() {
  const settings = loadSettings();
  const [meal, setMeal] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchMealFromGroceries(groceriesArr, allergiesArr)
      .then(m => setMeal(m))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="bg-zinc-800 p-4 rounded-lg">Loading meal plan...</div>;
  if (!meal) return <div className="bg-zinc-800 p-4 rounded-lg">No meal found. Try again!</div>;

  return (
    <div className="bg-white/20 dark:bg-zinc-900/80 backdrop-blur-xl rounded-2xl shadow-xl p-4 w-full max-w-md mx-auto">
      <h3 className="font-semibold text-lime-400 text-lg mb-2">Suggested Meal</h3>
      <div className="text-white font-bold text-xl mb-1">{meal.title}</div>
      <img src={meal.image} alt={meal.title} className="rounded-xl w-full max-w-xs mx-auto" />
      <div className="mt-2 text-sm text-zinc-300">
        <strong>Ready in:</strong> {meal.readyInMinutes} min <br />
        <strong>Servings:</strong> {meal.servings} <br />
        <strong>Ingredients:</strong> {meal.extendedIngredients.map((ing: any) => ing.original).join(", ")}
      </div>
      <a
        href={meal.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-lime-400 mt-2 underline block"
      >
        See full recipe
      </a>
    </div>
  );  
}  
