// Local Deterministic NLP Matcher (No LLM Required)

const STOP_WORDS = new Set(['and', 'or', 'the', 'a', 'an', 'in', 'on', 'at', 'with', 'to', 'for', 'of', 'from', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'shall', 'should', 'can', 'could', 'may', 'might', 'must', 'about', 'as', 'this', 'that', 'these', 'those', 'which', 'who', 'whom', 'what', 'why', 'when', 'where', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now', 'we', 'you', 'they', 'it', 'me', 'us', 'them', 'my', 'your', 'their', 'our', 'his', 'her', 'its']);

function extractKeywords(text) {
  if (!text) return new Set();
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/);
  const keywords = words.filter(w => w.length > 2 && !STOP_WORDS.has(w));
  return new Set(keywords);
}

export const parseResumeWithAI = async (pdfText) => {
  // Gracefully fallback since LLM parsing structured JSON is dropped
  return {
    rawText: pdfText,
    summary: pdfText.substring(0, 500) + '...',
    skills: Array.from(extractKeywords(pdfText)).slice(0, 15)
  };
};

export const scoreCandidateWithAI = async (jobDescription, parsedResume, jobTitle = '', jobSkills = []) => {
  try {
    // 1. Gather Job Keywords
    const jobText = `${jobTitle} ${jobDescription} ${(jobSkills || []).join(' ')}`;
    const jobKeywords = extractKeywords(jobText);
    
    // Default fail-safes
    if (jobKeywords.size === 0) {
      return { score: 50, reasoning: 'Insufficient job description to score accurately.', strengths: [], weaknesses: [], recommendation: 'Review manually' };
    }

    // 2. Gather Resume Keywords
    const resumeText = parsedResume.rawText || '';
    const resumeWords = resumeText.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/);
    const resumeWordSet = new Set(resumeWords);

    // 3. Find Intersections
    const matched = [];
    const missing = [];
    
    for (const kw of jobKeywords) {
      if (resumeWordSet.has(kw)) matched.push(kw);
      else missing.push(kw);
    }

    // 4. Calculate Score
    let score = Math.round((matched.length / jobKeywords.size) * 100);
    
    // Add a slight boost if the jobTitle keywords are explicitly found
    const titleKeywords = extractKeywords(jobTitle);
    let titleMatches = 0;
    for (const tkw of titleKeywords) {
      if (resumeWordSet.has(tkw)) titleMatches++;
    }
    if (titleKeywords.size > 0 && titleMatches / titleKeywords.size > 0.5) {
      score = Math.min(100, score + 15);
    }
    
    // Scale standard deviation since pure intersection rarely hits 100% naturally
    score = Math.min(100, Math.round(score * 1.5));

    return {
      score,
      reasoning: `Candidate matched ${matched.length} out of ${jobKeywords.size} key terms extracted from the job posting.`,
      strengths: matched.slice(0, 5),
      weaknesses: missing.slice(0, 5),
      recommendation: score > 75 ? 'Highly Recommended' : (score > 50 ? 'Recommended' : 'Requires Review')
    };
  } catch (error) {
    console.error('scoreCandidateWithAI Error:', error);
    return { score: 0, reasoning: 'Failed to evaluate score automatically.', strengths: [], weaknesses: [], recommendation: 'Error' };
  }
};

export const generateInterviewQuestionsWithAI = async (jobTitle, jobDescription, candidateProfile) => {
  // Deterministic fallback returning structured JSON bypassing LLMs
  const matchedSkills = (candidateProfile?.skills || []).slice(0, 3).join(', ') || 'your listed skills';
  return [
    { question: `Tell us about your experience related to ${jobTitle || 'this role'}.`, category: 'behavioral', difficulty: 'easy' },
    { question: `How have you practically applied ${matchedSkills} in past projects?`, category: 'technical', difficulty: 'medium' },
    { question: 'Describe a challenging technical problem you solved under pressure.', category: 'behavioral', difficulty: 'medium' },
    { question: 'What is your system design approach when architecting a scalable module from scratch?', category: 'technical', difficulty: 'hard' }
  ];
};

export const detectBiasWithAI = async (jobDescription) => {
  // Deterministic fallback scanning for basic rigid keywords
  const flags = [];
  const lowerDesc = jobDescription.toLowerCase();
  
  if (lowerDesc.includes('ninja') || lowerDesc.includes('rockstar') || lowerDesc.includes('guru')) {
    flags.push({ word: 'ninja/rockstar/guru', reason: 'Can discourage applicants who prefer collaborative phrasing over hyper-competitive language.', suggestion: 'expert, specialist, professional' });
  }
  if (lowerDesc.includes('guys')) {
    flags.push({ word: 'guys', reason: 'Gendered term may exclude non-male applicants.', suggestion: 'team, folks, everyone' });
  }

  const score = Math.max(0, 100 - (flags.length * 15));
  
  return { score, flags };
};
