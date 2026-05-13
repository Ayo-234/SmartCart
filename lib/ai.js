import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

// Initialize Clients
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

const DEFAULT_PROVIDER = process.env.AI_PROVIDER || 'gemini'; // 'gemini' or 'openai'

// Circuit Breaker State
const circuitBreaker = {
  gemini: { isOpen: false, retryAfter: 0 },
  openai: { isOpen: false, retryAfter: 0 }
};

/**
 * Checks if the provider is currently blocked by rate limiting
 */
function isProviderBlocked(provider) {
  const state = circuitBreaker[provider];
  if (state && state.isOpen) {
    if (Date.now() > state.retryAfter) {
      state.isOpen = false;
      return false;
    }
    return true;
  }
  return false;
}

/**
 * Handles 429 errors and opens the circuit
 */
function handleRateLimit(provider, error) {
  let retryAfter = Date.now() + 60000; // Default 1 minute
  
  // Extract retry delay from Gemini error if available
  if (provider === 'gemini' && error.errorDetails) {
    const retryInfo = error.errorDetails.find(d => d['@type'] === 'type.googleapis.com/google.rpc.RetryInfo');
    if (retryInfo && retryInfo.retryDelay) {
      // retryDelay is often a string like "53s" or "3.5s"
      const seconds = parseFloat(retryInfo.retryDelay.replace('s', ''));
      if (!isNaN(seconds)) {
        retryAfter = Date.now() + (seconds * 1000) + 2000; // Add 2s buffer
      }
    }
  }

  circuitBreaker[provider] = {
    isOpen: true,
    retryAfter
  };
  
  console.warn(`[AI Circuit Breaker] ${provider} is now OPEN. Retrying after ${new Date(retryAfter).toLocaleTimeString()}`);
}

/**
 * Connection Test Helper
 */
export async function testAIConnection() {
  const provider = DEFAULT_PROVIDER.toLowerCase();
  try {
    if (provider === 'openai') {
      if (!openai) throw new Error('OpenAI client not initialized (check OPENAI_API_KEY)');
      await openai.chat.completions.create({
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
  let provider = DEFAULT_PROVIDER.toLowerCase();
  
  // Try alternative if primary is blocked
  if (isProviderBlocked(provider)) {
    provider = provider === 'gemini' ? 'openai' : 'gemini';
    if (isProviderBlocked(provider)) return []; // Both blocked
  }

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
      const content = response.choices[0].message.content;
      const data = JSON.parse(content);
      return Array.isArray(data) ? data : data.keywords || Object.values(data)[0] || [];
    } else if (provider === 'gemini' && genAI) {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const jsonMatch = text.match(/\[.*?\]/s);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    }
    return [];
  } catch (error) {
    if (error.status === 429 || error.message?.includes('429')) {
      handleRateLimit(provider, error);
    } else {
      console.error(`[AI Error] ${provider}:`, error.message);
    }
    
    // If first attempt failed and it was the default provider, maybe try the other one?
    // But for simplicity and to avoid cascades, we'll just return empty and let the route fallback.
    return [];
  }
}

/**
 * AI-powered search query enhancement
 */
export async function expandSearchQuery(query) {
  let provider = DEFAULT_PROVIDER.toLowerCase();
  if (isProviderBlocked(provider)) {
    provider = provider === 'gemini' ? 'openai' : 'gemini';
    if (isProviderBlocked(provider)) return [query];
  }

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
    } else if (provider === 'gemini' && genAI) {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const jsonMatch = text.match(/\[.*?\]/s);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : [query];
    }
    return [query];
  } catch (error) {
    if (error.status === 429 || error.message?.includes('429')) {
      handleRateLimit(provider, error);
    }
    return [query];
  }
}

/**
 * AI-powered product description generator
 */
export async function generateProductDescription(productName, category) {
  let provider = DEFAULT_PROVIDER.toLowerCase();
  if (isProviderBlocked(provider)) {
    provider = provider === 'gemini' ? 'openai' : 'gemini';
    if (isProviderBlocked(provider)) return '';
  }

  const prompt = `Write a short, compelling product description (2-3 sentences) for a ${category} called "${productName}". Focus on key benefits.`;

  try {
    if (provider === 'openai' && openai) {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }]
      });
      return response.choices[0].message.content.trim();
    } else if (provider === 'gemini' && genAI) {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    }
    return '';
  } catch (error) {
    if (error.status === 429 || error.message?.includes('429')) {
      handleRateLimit(provider, error);
    }
    return '';
  }
}

/**
 * AI Chatbot response
 */
export async function getChatbotResponse(userMessage, history = []) {
  let provider = DEFAULT_PROVIDER.toLowerCase();
  if (isProviderBlocked(provider)) {
    provider = provider === 'gemini' ? 'openai' : 'gemini';
    if (isProviderBlocked(provider)) return 'I am currently receiving too many requests. Please try again in a moment.';
  }

  const historyText = history.map(h => `${h.role}: ${h.text}`).join('\n');
  const prompt = `You are QuickCart's support assistant. Help users with products, orders, and returns. Be concise.\n\nHistory:\n${historyText}\n\nUser: ${userMessage}\n\nAssistant:`;

  try {
    if (provider === 'openai' && openai) {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }]
      });
      return response.choices[0].message.content.trim();
    } else if (provider === 'gemini' && genAI) {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    }
    return 'Assistant unavailable.';
  } catch (error) {
    if (error.status === 429 || error.message?.includes('429')) {
      handleRateLimit(provider, error);
      return 'I am currently experiencing high traffic. Please try again in a minute.';
    }
    return 'Sorry, I encountered an error.';
  }
}

