import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

// Initialize Clients
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

const PROVIDER = process.env.AI_PROVIDER || 'gemini'; // 'gemini' or 'openai'

/**
 * Connection Test Helper
 */
export async function testAIConnection() {
  const provider = PROVIDER.toLowerCase();
  try {
    if (provider === 'openai') {
      if (!openai) throw new Error('OpenAI client not initialized (check OPENAI_API_KEY)');
      const res = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: "Ping" }],
        max_tokens: 5
      });
      return { success: true, provider: 'OpenAI', message: 'Connection successful' };
    } else {
      if (!genAI) throw new Error('Gemini client not initialized (check GEMINI_API_KEY)');
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      await model.generateContent("Ping");
      return { success: true, provider: 'Gemini', message: 'Connection successful' };
    }
  } catch (error) {
    return { success: false, provider, error: error.message };
  }
}

/**
 * Gets AI-powered product recommendation keywords
 */
export async function getRecommendationKeywords(history) {
  const provider = PROVIDER.toLowerCase();
  
  const historyText = history
    .map(i => i.type === 'search' 
      ? `searched for: "${i.query}"` 
      : `${i.actionType}: ${i.productName} (${i.category})`
    )
    .join(', ');

  const prompt = `Based on this user's activity: [${historyText}], suggest product categories and keywords they are likely to purchase next. Return ONLY a valid JSON array of strings. Example: ["laptops", "gaming accessories", "monitors"]. No explanations, no markdown.`;

  try {
    if (provider === 'openai' && openai) {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });
      // OpenAI usually needs a wrapper for raw arrays if using json_object, so we parse carefully
      const content = response.choices[0].message.content;
      const data = JSON.parse(content);
      return Array.isArray(data) ? data : data.keywords || Object.values(data)[0] || [];
    } else if (genAI) {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const jsonMatch = text.match(/\[.*?\]/s);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    }
    return [];
  } catch (error) {
    console.error(`${provider} AI error:`, error);
    return [];
  }
}

/**
 * AI-powered search query enhancement
 */
export async function expandSearchQuery(query) {
  const provider = PROVIDER.toLowerCase();
  const prompt = `Expand this product search query into related keywords: "${query}". Return ONLY a JSON array of strings (5 max).`;

  try {
    if (provider === 'openai' && openai) {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }]
      });
      const text = response.choices[0].message.content.trim();
      const jsonMatch = text.match(/\[.*?\]/s);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : [query];
    } else if (genAI) {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const jsonMatch = text.match(/\[.*?\]/s);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : [query];
    }
    return [query];
  } catch (error) {
    return [query];
  }
}

/**
 * AI-powered product description generator
 */
export async function generateProductDescription(productName, category) {
  const provider = PROVIDER.toLowerCase();
  const prompt = `Write a short, compelling product description (2-3 sentences) for a ${category} called "${productName}". Focus on key benefits.`;

  try {
    if (provider === 'openai' && openai) {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }]
      });
      return response.choices[0].message.content.trim();
    } else if (genAI) {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    }
    return '';
  } catch (error) {
    return '';
  }
}

/**
 * AI Chatbot response
 */
export async function getChatbotResponse(userMessage, history = []) {
  const provider = PROVIDER.toLowerCase();
  const historyText = history.map(h => `${h.role}: ${h.text}`).join('\n');
  const prompt = `You are QuickCart's support assistant. Help users with products, orders, and returns. Be concise.\n\nHistory:\n${historyText}\n\nUser: ${userMessage}\n\nAssistant:`;

  try {
    if (provider === 'openai' && openai) {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }]
      });
      return response.choices[0].message.content.trim();
    } else if (genAI) {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    }
    return 'Assistant unavailable.';
  } catch (error) {
    return 'Sorry, I encountered an error.';
  }
}
