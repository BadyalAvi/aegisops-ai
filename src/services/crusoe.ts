import axios from 'axios';

const CRUSOE_API_URL = 'https://api.inference.crusoecloud.com/v1/chat/completions';
const CRUSOE_BEARER_TOKEN = 'Bearer 42ffcJ8DTTyXkYJuqWWPeQ$2a$10$0yJ8QR8q0kPd.vo5thNGV.eOXwHcYR.BqVcyYKd.ghaZVaw8wGiEa';

export async function analyzeIncident(systemPrompt: string, logData: string) {
  try {
    const response = await axios.post(
      CRUSOE_API_URL,
      {
        model: "hack-crusoe/Nemotron-3-Nano-30B-A3B-FP8",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `ANOMALY LOG:\n${logData}` }
        ],
        max_tokens: 512,
        temperature: 0.1 // <-- Forces strict, deterministic JSON formatting
      },
      {
        headers: {
          'Authorization': CRUSOE_BEARER_TOKEN,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("🚨 Crusoe API Connection Failed:", error);
    throw error;
  }
}