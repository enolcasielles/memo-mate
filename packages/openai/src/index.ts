import OpenAI from "openai";

export * from './Agent';
export * from './Tool';
export * from './Thread';
export * from './Embeddings';

export const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
