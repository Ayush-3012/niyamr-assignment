import axios from "axios";

export async function checkWithLLM(pdfText, rules) {
  const prompt = `
You are an AI document checker. 
Given the following PDF text and rules, analyze the document.

Return a JSON array. Each item must be:
{
  "rule": "...",
  "status": "pass" or "fail",
  "evidence": "one short sentence from PDF",
  "reasoning": "why it passed or failed",
  "confidence": number (0-100)
}

PDF TEXT:
${pdfText}

RULES:
${rules.join("\n")}
  `;

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        response_format: { type: "json_object" },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (err) {
    console.error("GROQ API Error:", err.response?.data || err.message);
    throw new Error("LLM request failed");
  }
}
