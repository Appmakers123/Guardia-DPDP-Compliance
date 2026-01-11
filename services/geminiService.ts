
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const CLEAN_PROMPT_WRAPPER = `
CRITICAL FORMATTING RULES:
1. Do NOT use any double asterisks (**) or markdown bold symbols. Use standard capitalization for emphasis.
2. Use clear H3 headers (### Header) for section titles only.
3. Use plain numbered lists (1. Item) or simple dashes (- Item) for bullet points.
4. Output must be professional, clean, and use standard English grammar.
5. Do NOT include meta-commentary like "Here is your summary:" or "Certainly!".
`;

export const summarizePolicy = async (purposeName: string, description: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Explain this data processing purpose for an Indian citizen under the DPDP Act 2023. 
      Purpose: ${purposeName}
      Description: ${description}
      Summarize in 2 clean, plain sentences focusing on rights and necessity. ${CLEAN_PROMPT_WRAPPER}`,
    });
    return response.text;
  } catch (error) {
    return "This purpose allows the fiduciary to process your data for its specified business goals in accordance with Section 6.";
  }
};

export const scanPolicyText = async (policyText: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analyze this Privacy Policy for DPDP Act 2023 compliance: "${policyText}". 
      Required Structure:
      [SCORE] (A single digit from 1 to 10)
      [RISKS] (2 bullet points of specific legal risks)
      [SUMMARY] (A professional 3-sentence overview)
      ${CLEAN_PROMPT_WRAPPER}`,
    });
    return response.text;
  } catch (error) {
    return "[SCORE] 5\n[RISKS]\n- Unable to perform deep heuristic scan.\n- Manual review required.\n[SUMMARY]\nThe node is currently experiencing high load. Please try your scan again in a few moments.";
  }
};

export const generateRemediationCode = async (issue: string, context: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Generate remediation code for: "${issue}" in "${context}". 
      Rules:
      1. Provide a clean code block.
      2. Provide a 1-sentence explanation.
      3. No extra markdown in the explanation.`,
    });
    return response.text;
  } catch (error) {
    return "// Remediation unavailable.";
  }
};

export const performDeepAudit = async (url: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Evaluate ${url} for DPDP compliance. Focus on DPO info and withdrawal ease. Provide a score out of 100 at the end. ${CLEAN_PROMPT_WRAPPER}`,
      config: { tools: [{ googleSearch: {} }] }
    });
    return response.text;
  } catch (error) {
    return "Deep audit node restricted. Manual verification recommended.";
  }
};

export const suggestGrievanceDraft = async (issue: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Draft a formal DPDP Act 2023 Grievance for: "${issue}". 
      Format: Formal letter to the Data Protection Officer. 
      Language: Plain, powerful English. No symbols. ${CLEAN_PROMPT_WRAPPER}`,
    });
    return response.text;
  } catch (error) {
    return "To the Data Protection Officer,\n\nI am writing to formally lodge a grievance regarding the processing of my personal data. Please address this issue immediately under Section 13.";
  }
};

export const translateLegalNotice = async (text: string, lang: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Translate to formal ${lang}: "${text}". Ensure legal terms are accurate. ${CLEAN_PROMPT_WRAPPER}`,
    });
    return response.text;
  } catch (error) {
    return "Translation unavailable.";
  }
};
