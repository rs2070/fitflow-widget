// /utils/api.ts

export async function fetchRandomMeal(allergies: string[] = [], groceries: string[] = []) {
    // Uses Spoonacular (DEMO API KEY, replace with your free one from https://spoonacular.com/food-api)
    const key = 'c2715728fc6d4371bd091a353eb9d8b5'; // <-- Use your own key!
    let url = `https://api.spoonacular.com/recipes/random?number=1&apiKey=${key}`;
    if (allergies.length > 0) url += `&excludeIngredients=${allergies.join(',')}`;
    // (Spoonacular supports 'includeIngredients', but limited by free tier)
    const res = await fetch(url);
    const data = await res.json();
    return data.recipes?.[0];
  }

export async function fetchMealFromGroceries(groceries: string[] = [], allergies: string[] = []) {
    if (!groceries.length) return fetchRandomMeal(allergies, []);
    const key = 'c2715728fc6d4371bd091a353eb9d8b5';
    let url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${groceries.join(',')}&number=1&apiKey=${key}`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data.length) return fetchRandomMeal(allergies, []);
    // Fetch full recipe details:
    const recipeId = data[0].id;
    const detailRes = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${key}`);
    return await detailRes.json();
  }
  
  export async function fetchMotivationalQuote(mood: string) {
    if (mood && mood.trim()) {
      try {
        const apiKey = 'AIzaSyAvygwp2uo20HL_rjQm_G2v6xJ9HawmqI8'; // Replace with your real key
        const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey;
  
        const prompt = `Don't send anything else but a one line motivational quote based on this mood: "${mood}"`;
        //console.log('Prompting Gemini:', prompt);
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        });
  
        const data = await res.json();
        console.log('Gemini raw response:', data);
  
        const quote = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (quote) {
          console.log('Gemini quote:', quote);
          return quote.trim();
        }
      } catch (err) {
        console.error('Gemini fetch error:', err);
      }
    }
    const quotes = [
      "You’re stronger than you think.",
      "Small progress is still progress.",
      "The only bad workout is the one you didn’t do.",
      "Discipline beats motivation every time.",
      "Be proud of every step you take."
    ];
    const fallback = quotes[Math.floor(Math.random() * quotes.length)];
    //console.log('Using fallback quote:', fallback);
    return fallback;
  }  
  
  export async function fetchWorkout(type: string = "full_body") {
    return {
      name: type === "powerlifting" ? "Powerlifting Routine" : "Full Body Workout",
      exercises: [
        { name: "Squat", sets: 4, reps: 8 },
        { name: "Bench Press", sets: 4, reps: 8 },
        { name: "Deadlift", sets: 3, reps: 5 },
      ],
      duration: 60,
      muscleGroups: ["legs", "chest", "back"],
    };
  }

  export async function fetchGeminiWorkout(category: string): Promise<string[]> {
    const apiKey = 'AIzaSyAvygwp2uo20HL_rjQm_G2v6xJ9HawmqI8';
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  
    // Use your exact prompt
    const prompt = `
  Give me a short bullet list (4-5 lines) of exercises for a "legs, check, and back" workout.
  Each line must be in this format: "[sets]x[reps] [exercise name]".
  Only output the bullet list, with one exercise per line, no extra text, no explanations.
  `.trim();
  
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
  
      const data = await res.json();
      let text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      // Ensure TypeScript knows 'line' is a string
      let lines = text
        .split(/\r?\n/)
        .map((line: string) => line.replace(/^[-*•]\s*/, "").trim())
        .filter((line: string) => line && /\d+x\d+/.test(line)); // Only valid exercise lines
  
      return lines;
    } catch (err) {
      return [];
    }
  }
  