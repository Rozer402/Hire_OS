import { model } from '../config/gemini.js';

// Helper to strip markdown formatting from Gemini response
const stripMarkdown = (text) => {
  if (!text) return '';
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) cleaned = cleaned.replace(/^```json/, '');
  if (cleaned.startsWith('```')) cleaned = cleaned.replace(/^```/, '');
  if (cleaned.endsWith('```')) cleaned = cleaned.replace(/```$/, '');
  return cleaned.trim();
};

export const parseResumeWithAI = async (pdfText) => {
  try {
    if (!model) throw new Error('AI Model not initialized');
    
    const prompt = 'Extract structured data from this resume. Return ONLY a JSON object with: name, email, skills (array), experienceYears (number), education (array of {degree, institution, year}), summary (string). Resume text: ' + pdfText;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(stripMarkdown(text));
  } catch (error) {
    console.error('parseResumeWithAI Error:', error);
    throw new Error('Failed to parse resume with AI');
  }
};

export const scoreCandidateWithAI = async (jobDescription, parsedResume) => {
  try {
    if (!model) throw new Error('AI Model not initialized');
    
    const prompt = 'Score this candidate for this job. Return ONLY a JSON object with: score (0-100 number), reasoning (string), strengths (array of strings), weaknesses (array of strings), recommendation (string). Job: ' + jobDescription + ' Candidate: ' + JSON.stringify(parsedResume);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(stripMarkdown(text));
  } catch (error) {
    console.error('scoreCandidateWithAI Error:', error);
    throw new Error('Failed to score candidate with AI');
  }
};

export const generateInterviewQuestionsWithAI = async (jobTitle, jobDescription, candidateProfile) => {
  try {
    if (!model) throw new Error('AI Model not initialized');
    
    const prompt = 'Generate 8 interview questions for this candidate applying for this role. Return ONLY a JSON array of objects with: question (string), category (technical/behavioral/situational), difficulty (easy/medium/hard). Job: ' + jobTitle + ' Description: ' + jobDescription + ' Candidate: ' + JSON.stringify(candidateProfile);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(stripMarkdown(text));
  } catch (error) {
    console.error('generateInterviewQuestionsWithAI Error:', error);
    throw new Error('Failed to generate interview questions with AI');
  }
};

export const detectBiasWithAI = async (jobDescription) => {
  try {
    if (!model) throw new Error('AI Model not initialized');
    
    const prompt = 'Analyze this job description for biased language. Return ONLY a JSON object with: score (0-100 inclusivity score), flags (array of {word, reason, suggestion}). Job description: ' + jobDescription;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(stripMarkdown(text));
  } catch (error) {
    console.error('detectBiasWithAI Error:', error);
    throw new Error('Failed to detect bias with AI');
  }
};
