```markdown
# 🛡️ AegisOps AI - Autonomous SRE Commander
**Powered by Crusoe Cloud & NVIDIA Nemotron-3-Nano**

AegisOps is a fully functional, event-driven DevOps observability platform. It autonomously intercepts catastrophic server logs, routes them to Crusoe's managed inference network, and generates deterministic, actionable bash scripts to remediate infrastructure anomalies in real-time.

## 🚀 Enterprise Architecture
Unlike standard AI wrappers, AegisOps is built with extreme architectural resilience:
* **Dynamic Threat Telemetry:** Live cluster vitals react instantly to ingested anomalies.
* **Autonomous Remediation:** Generates precise `bash` mitigation scripts via Nemotron-3-Nano.
* **Persistent State Ledger:** Utilizes local storage to maintain an immutable audit trail of past incidents.
* **Chaos-Proof Fallback Protocol:** If the primary cloud API experiences an outage, AegisOps intercepts the network failure and seamlessly routes to a local heuristic fallback engine, ensuring zero UI crashes.

## 🛠️ Tech Stack
* **Frontend:** React, Vite, Tailwind CSS
* **Backend:** Node.js, Hono, TypeScript
* **Inference Pipeline:** Crusoe Cloud REST API
* **Model:** `hack-crusoe/Nemotron-3-Nano-30B-A3B-FP8`

## ⚙️ Local Deployment Protocol
Because this tool features active network manipulation for its fallback protocols, you can run the full environment locally.

### 1. Initialize the Backend Core
\`\`\`bash
cd backend
npm install
# Create a .env file and add: CRUSOE_BEARER_TOKEN=your_token_here
npx tsx src/index.ts
\`\`\`

### 2. Initialize the SRE Dashboard
Open a new terminal instance:
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
Navigate to `http://localhost:5173` to access the control matrix.

## 🛡️ Testing the Chaos-Proof Fallback
To verify the system's resilience:
1. Start both servers and successfully run an analysis.
2. Kill the backend terminal (`Ctrl + C`).
3. Deploy a new analysis on the frontend. The system will gracefully catch the network timeout and deploy the Local Heuristic Fallback Engine.