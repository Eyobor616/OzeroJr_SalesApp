import { GoogleGenAI } from "@google/genai";
import { AppState } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateInsights = async (data: AppState, query?: string) => {
  try {
    const ai = getClient();
    // Prepare a summary of the data to reduce token count
    const salesSummary = data.sales.slice(0, 50).map(s => ({
      date: s.date.split('T')[0],
      amount: Math.round(s.totalAmount),
      customer: s.customerName
    }));

    const productsSummary = data.products.map(p => ({
      name: p.name,
      stock: p.stock,
      price: p.price
    }));

    const prompt = `
      You are an expert Sales Analyst AI. 
      Analyze the following sales data JSON summary.
      
      Current Date: ${new Date().toISOString().split('T')[0]}
      
      Data Summary:
      - Sales (last 50): ${JSON.stringify(salesSummary)}
      - Products: ${JSON.stringify(productsSummary)}
      - Goals: ${JSON.stringify(data.goals)}

      User Query: ${query || "Provide 3 key actionable insights to improve revenue and inventory management."}

      Format your response as a clean, markdown-formatted list of insights. Keep it professional and concise.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to generate insights at this time. Please check your API key or try again later.";
  }
};