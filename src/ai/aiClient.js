export async function aiClient(prompt) {

  const apiKey = import.meta.env.VITE_GROQ_KEY;
  const modelName = "llama-3.3-70b-versatile";

  const res = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + apiKey
      },
      body: JSON.stringify({
        model: modelName,
        messages: [{ role: "user", content: prompt }]
      })
    }
  );

  const data = await res.json();

  return {
    content: data.choices[0].message.content,
    model: modelName,
    provider: "Groq"
  };
}