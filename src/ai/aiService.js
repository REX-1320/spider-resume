// AI Service Layer — Groq (with key rotation) + Gemini fallback

export function createAIService({ groqKey, groqKey2, geminiKey }) {
  let groqCallCount = 0;

  const getGroqKey = () => {
    if (!groqKey2) return groqKey;
    const key = groqCallCount % 2 === 0 ? groqKey : groqKey2;
    groqCallCount += 1;
    return key;
  };

  // ── Groq: fast text AI — alternates between 2 keys ───────────────────
  const callGroq = async (prompt, forceKey = null) => {
    const key = forceKey || getGroqKey();
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + key },
      body: JSON.stringify({ model: "llama-3.3-70b-versatile", max_tokens: 2048, messages: [{ role: "user", content: prompt }] }),
    });
    const data = await res.json();
    if ((res.status === 429 || data.error?.code === 429) && groqKey2 && key !== groqKey2) {
      console.warn("Groq key 1 rate limited, switching to key 2");
      return callGroq(prompt, groqKey2);
    }
    if ((res.status === 429 || data.error?.code === 429) && key === groqKey2) {
      console.warn("Both Groq keys rate limited, trying Gemini");
      if (geminiKey) return callGemini(prompt);
    }
    if (data.error) throw new Error(data.error.message);
    return data.choices[0].message.content.replace(/```json|```/g, "").trim();
  };

  // ── Gemini: text fallback ─────────────────────────────────────────────
  const callGemini = async (prompt) => {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 2048, temperature: 0.7 },
        }),
      }
    );
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.candidates[0].content.parts[0].text.replace(/```json|```/g, "").trim();
  };

  // ── callAI: Groq(alternating 2 keys) → Gemini fallback ───────────────
  const callAI = async (prompt) => {
    if (groqKey) {
      try { return await callGroq(prompt); }
      catch (e) {
        console.warn("Groq failed, falling back to Gemini:", e.message);
        if (geminiKey) return await callGemini(prompt);
        throw e;
      }
    }
    if (geminiKey) return await callGemini(prompt);
    throw new Error("No AI API key configured. Add VITE_GROQ_KEY or VITE_GEMINI_KEY.");
  };

  // ── callVisionAI: Groq primary (fast), Gemini fallback (vision) ───────
  const callVisionAI = async (base64, mimeType, prompt) => {
    // Try Groq first using llama-4-scout (supports vision) — alternates keys
    const visionGroqKey = getGroqKey();
    if (visionGroqKey) {
      try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": "Bearer " + visionGroqKey },
          body: JSON.stringify({
            model: "meta-llama/llama-4-scout-17b-16e-instruct",
            max_tokens: 1500,
            messages: [{
              role: "user",
              content: [
                { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64}` } },
                { type: "text", text: prompt }
              ]
            }]
          }),
        });
        const data = await res.json();
        if (!data.error) {
          return data.choices?.[0]?.message?.content?.replace(/```json|```/g, "").trim() || "";
        }
        console.warn("Groq vision failed, trying Gemini:", data.error.message);
      } catch (e) {
        console.warn("Groq vision error, trying Gemini:", e.message);
      }
    }
    // Fallback to Gemini
    if (!geminiKey) throw new Error("No vision API available. Add VITE_GROQ_KEY or VITE_GEMINI_KEY.");
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [
            { inline_data: { mime_type: mimeType, data: base64 } },
            { text: prompt }
          ]}],
          generationConfig: { maxOutputTokens: 2048, temperature: 0.2 },
        }),
      }
    );
    const data = await res.json();
    if (data.error?.status === "RESOURCE_EXHAUSTED" || res.status === 429) throw new Error("Rate limit hit — wait 30 seconds and try again.");
    if (data.error) throw new Error(data.error.message);
    return data.candidates?.[0]?.content?.parts?.[0]?.text?.replace(/```json|```/g, "").trim() || "";
  };

  return { callAI, callVisionAI };
}
