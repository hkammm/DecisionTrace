
import { GoogleGenAI, Type } from "@google/genai";
import { Decision, AIInsight } from "../types";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

export const geminiService = {
  analyzeDecisionPatterns: async (decisions: Decision[]): Promise<AIInsight> => {
    if (decisions.length === 0) {
      return { patterns: [], cognitiveBiases: [], suggestedReflections: ["Start tracking decisions to see patterns."] };
    }

    const reviewedDecisions = decisions.filter(d => d.review);
    const decisionLog = reviewedDecisions.map(d => ({
      title: d.title,
      context: d.context,
      confidence: d.confidenceLevel,
      outcome: d.review?.outcome,
      assumptions: d.assumptions,
      lessons: d.review?.lessonsLearned
    }));

    const prompt = `
      As a cognitive psychologist and decision scientist, analyze the following decision log for a user.
      Focus on identifying repeating patterns in their decision-making logic, common cognitive biases (like overconfidence, sunk cost, or confirmation bias), and generate reflective questions.
      
      CRITICAL:
      1. Do not tell the user what to decide next.
      2. Highlight if they frequently get assumptions wrong.
      3. Identify if their confidence level correlates with success or failure.
      
      User Decision Log:
      ${JSON.stringify(decisionLog)}
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              patterns: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Observed repeating behavioral patterns in decision making."
              },
              cognitiveBiases: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Likely cognitive biases shown in the log."
              },
              suggestedReflections: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Provocative questions to help the user grow."
              }
            },
            required: ["patterns", "cognitiveBiases", "suggestedReflections"]
          }
        }
      });

      return JSON.parse(response.text);
    } catch (error) {
      console.error("Gemini Analysis Error:", error);
      return {
        patterns: ["Unable to analyze patterns at this time."],
        cognitiveBiases: [],
        suggestedReflections: ["Take some time to manually review your failed assumptions."]
      };
    }
  }
};
