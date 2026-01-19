
const aiService = {
    getFinancialSuggestions: async (data) => {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

        if (!apiKey) {
            throw new Error("Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your .env file.");
        }
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        const prompt = `
      Role: You are a helpful Financial Coach.
      
      Your Goal: Analyze *spending amounts* to reveal where the money is going and how to save.
      
      CRITICAL RULES:
      1. NEVER criticize the user's data entry, categorization, or tracking methods.
      2. If an item seems weirdly categorized (e.g. iPhone as Utility), IGNORE the category name and focus on the AMOUNT.
      3. NEVER use words like "miscategorized", "inaccurate", "disconnect", or "tracking".
      4. Talk ONLY about the *financial impact*: "You spent 60k on a phone - that's a huge chunk of your monthly income."
      
      Output:
      - 3 simple, friendly, observations about their spending habits.
      - Focus on specific expensive items vs. their income.
      - Keep it under 500 characters.
      
      Financial Data:
      - Balance: ${JSON.stringify(data.balance)}
      - Budgets: ${JSON.stringify(data.budgets)}
      - Recent Spending: ${JSON.stringify(data.recentTransactions)}
    `;

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("Gemini API Error Detail:", errorData);
                throw new Error(`AI Service Error: ${response.status} ${response.statusText} `);
            }

            const result = await response.json();

            if (!result.candidates || result.candidates.length === 0 || !result.candidates[0].content) {
                throw new Error("No suggestions received from AI.");
            }

            const text = result.candidates[0].content.parts[0].text;
            return text;
        } catch (error) {
            console.error("AI Service Error:", error);
            throw error; // Propagate error to component
        }
    }
};

export default aiService;
