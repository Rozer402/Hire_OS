import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

let genAI = null;
let model = null;

try {
  if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
  } else {
    console.warn('GEMINI_API_KEY is not set. AI features will fail.');
  }
} catch (error) {
  console.error('Gemini init error:', error);
}

export { genAI, model };
