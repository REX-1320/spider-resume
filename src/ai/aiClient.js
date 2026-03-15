export async function aiClient(prompt) {

  const apiKey = import.meta.env.VITE_GROQ_KEY;

  const res = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + apiKey
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }]
      })
    }
  );

  const data = await res.json();

  return data.choices[0].message.content;
}