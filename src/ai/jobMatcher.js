import { aiClient } from "./aiClient";

export async function findJobPlatforms(resume) {

  const prompt = `
Based on this resume suggest job platforms.

Return JSON:
[
 {
  platform:"",
  url:"",
  pros:[],
  cons:[]
 }
]
`;

  const res = await aiClient(prompt);

  return JSON.parse(res);
}