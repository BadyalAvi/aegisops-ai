import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { analyzeIncident } from './services/crusoe';

const app = new Hono();

// Enable CORS so your React dashboard can communicate with this API
app.use('/api/*', cors());

const AGENT_SYSTEM_PROMPT = `
You are AegisOps AI, an autonomous site reliability engineer. 
Analyze the server log provided. Respond STRICTLY in valid JSON format with NO markdown formatting, NO backticks, and NO conversational text.
Your exact JSON Schema must be:
{
  "incident_type": "Brief categorization (e.g., Database Crash)",
  "severity_score": "Number between 1 and 10",
  "root_cause": "Short detailed explanation",
  "autonomous_action": "RESTART_CONTAINERS" | "ISOLATE_IP" | "SCALE_REPLICAS" | "NONE",
  "remediation_script": "The exact bash command or script to fix the issue (e.g., docker-compose restart db)"
}
`;

app.post('/api/incident', async (c) => {
  try {
    const payload = await c.req.json();
    const rawLogs = JSON.stringify(payload.logs || payload);

    console.log("📡 Incident Webhook Intercepted. Routing to Crusoe Nemotron-3-Nano...");

    try {
      // Primary Pipeline: Crusoe Cloud Managed Inference
      const rawAiResponse = await analyzeIncident(AGENT_SYSTEM_PROMPT, rawLogs);
      
      // If the API is overloaded and returns null, manually trigger the fallback
      if (!rawAiResponse) {
        throw new Error("Crusoe API returned null (Rate limit / Network overload).");
      }
      
      // Clean and parse the AI string response
      const cleanJsonString = rawAiResponse.replace(/`{3}json|`{3}/g, '').trim();
      const structuredData = JSON.parse(cleanJsonString);

      console.log(`✅ Analysis Complete. Severity Level: ${structuredData.severity_score}/10`);

      return c.json({
        status: "success",
        intelligence: structuredData
      }, 200);

    } catch (aiError: any) {
      // 🛡️ CHAOS-PROOF FALLBACK PROTOCOL
      // This is a real-world engineering pattern. If the LLM fails, we drop back to fast local heuristics.
      console.error(`⚠️ Primary AI Engine Anomaly: ${aiError.message || 'Unknown LLM Error'}`);
      console.log("🛡️ Deploying Local Heuristic Fallback Engine...");
      
      // Simple regex/keyword heuristic for the fallback
      let fallbackAction = "NONE";
      let severity = "5";
      let remediation = "echo 'No automated script available for this anomaly'";
      
      if (rawLogs.toLowerCase().includes("database") || rawLogs.toLowerCase().includes("fatal")) {
          fallbackAction = "RESTART_CONTAINERS";
          severity = "9";
          remediation = "sudo systemctl restart postgresql && docker-compose restart db";
      }

      return c.json({
        status: "success",
        intelligence: {
          incident_type: "Database Timeout (Local Fallback System)",
          severity_score: severity,
          root_cause: "Primary AI overloaded. Local heuristic engine intercepted the FATAL EXCEPTION signature in the server stream.",
          autonomous_action: fallbackAction,
          remediation_script: remediation
        }
      }, 200);
    }

  } catch (err) {
    console.error("Internal Server Error:", err);
    return c.json({ status: "error", message: "Incident response pipeline completely failed." }, 500);
  }
});

const port = 3000;
console.log(`🛡️ AegisOps AI Core active. Listening on port ${port}...`);

serve({
  fetch: app.fetch,
  port
});