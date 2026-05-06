import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * Gets AI-powered product recommendation keywords from Gemini
 * based on a user's interaction history.
 * @param {Array<{actionType: string, productName: string, category: string}>} interactions
 * @returns {Promise<string[]>} Array of keyword strings
 */
export async function getRecommendationKeywords(interactions) {
  if (!process.env.GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY not set, skipping AI recommendations.');
    return [];
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const historyText = interactions
      .map(i => `${i.actionType}: ${i.productName} (${i.category})`)
      .join(', ');

    const prompt = `Based on this user's browsing history: [${historyText}], suggest product categories and keywords they are likely to purchase next. Return ONLY a valid JSON array of strings. Example: ["laptops", "gaming accessories", "monitors"]. No explanations, no markdown, just the JSON array.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Safely parse the JSON array from Gemini response
    const jsonMatch = text.match(/\[.*?\]/s);
    if (!jsonMatch) return [];
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    if (error.status === 429) {
      console.warn('Gemini API quota exceeded (429). Using fallback recommendations.');
    } else {
      console.error('Gemini AI error:', error);
    }
    return [];
  }
}

/**
 * AI-powered search query enhancement
 * @param {string} query - raw search query from user
 * @returns {Promise<string[]>} expanded search terms
 */
export async function expandSearchQuery(query) {
  if (!process.env.GEMINI_API_KEY) return [query];

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `Expand this product search query into related keywords for an e-commerce site: "${query}". Return ONLY a JSON array of strings (5 max). Example: ["wireless headphones", "bluetooth earphones", "noise cancelling"]. No explanations.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    const jsonMatch = text.match(/\[.*?\]/s);
    if (!jsonMatch) return [query];
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    if (error.status !== 429) {
      console.error('Gemini expand search error:', error);
    }
    return [query];
  }
}

/**
 * AI-powered product description generator for admin
 * @param {string} productName
 * @param {string} category
 * @returns {Promise<string>}
 */
export async function generateProductDescription(productName, category) {
  if (!process.env.GEMINI_API_KEY) return '';

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `Write a short, compelling product description (2-3 sentences) for a ${category} called "${productName}". Focus on key benefits. Return plain text only.`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    if (error.status !== 429) {
      console.error('Gemini product description error:', error);
    }
    return '';
  }
}

/**
 * AI Chatbot response for customer support
 * @param {string} userMessage
 * @param {Array<{role: string, text: string}>} history
 * @returns {Promise<string>}
 */
export async function getChatbotResponse(userMessage, history = []) {
  if (!process.env.GEMINI_API_KEY) {
    return 'Sorry, our AI assistant is currently unavailable. Please try again later.';
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const historyText = history.map(h => `${h.role}: ${h.text}`).join('\n');

    const prompt = `You are QuickCart's friendly customer support AI assistant for an e-commerce site. Help users with product questions, order status, returns, and general shopping advice. Be concise and helpful.\n\nConversation history:\n${historyText}\n\nUser: ${userMessage}\n\nAssistant:`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    if (error.status === 429) {
      return 'Sorry, our AI assistant is currently over capacity. Please try again in a few minutes.';
    }
    console.error('Gemini chatbot error:', error);
    return 'Sorry, I encountered an error. Please try again.';
  }
}
