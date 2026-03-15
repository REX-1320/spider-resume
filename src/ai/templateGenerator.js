import { aiClient } from "./aiClient";

export async function generateTemplates(type) {

  const prompt = `
Generate 20 resume template ideas for ${type} style.
Return JSON array.

Example:
[
 { "name":"Modern Blue", "layout":"two column" }
]
`;

  const response = await aiClient(prompt);

  return JSON.parse(response);
}