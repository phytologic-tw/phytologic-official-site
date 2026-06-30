import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";

function readLocalEnv(mode) {
  const files = [".env", ".env.local", `.env.${mode}`, `.env.${mode}.local`];

  return files.reduce((env, file) => {
    const filePath = path.resolve(process.cwd(), file);
    if (!fs.existsSync(filePath)) return env;

    const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex === -1) continue;

      const key = trimmed.slice(0, separatorIndex).trim();
      const value = trimmed.slice(separatorIndex + 1).trim().replace(/^["']|["']$/g, "");
      env[key] = value;
    }

    return env;
  }, {});
}

function sendJson(res, statusCode, body) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function localAnalyzeApi(env) {
  return {
    name: "local-analyze-api",
    configureServer(server) {
      server.middlewares.use("/api/analyze", async (req, res) => {
        if (req.method !== "POST") {
          sendJson(res, 405, { error: "Method not allowed" });
          return;
        }

        let body;
        try {
          body = JSON.parse(await readBody(req));
        } catch {
          sendJson(res, 400, { error: "Invalid JSON body" });
          return;
        }

        if (!body.prompt) {
          sendJson(res, 400, { error: "Missing prompt" });
          return;
        }

        if (!env.ANTHROPIC_API_KEY) {
          sendJson(res, 500, { error: "Missing ANTHROPIC_API_KEY" });
          return;
        }

        try {
          const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": env.ANTHROPIC_API_KEY,
              "anthropic-version": "2023-06-01",
            },
            body: JSON.stringify({
              model: "claude-sonnet-4-20250514",
              max_tokens: 1000,
              messages: [{ role: "user", content: body.prompt }],
            }),
          });

          const data = await response.json();
          if (!response.ok) {
            sendJson(res, 500, { error: data });
            return;
          }

          const text = data.content?.map((content) => content.text || "").join("") || "";
          sendJson(res, 200, { result: text });
        } catch (error) {
          sendJson(res, 500, { error: error.message });
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = readLocalEnv(mode);

  return {
    build: {
      chunkSizeWarningLimit: 800,
    },
    resolve: {
      alias: {
        "@phytologic-design": path.resolve(process.cwd(), "src", "design-system"),
      },
    },
    plugins: [react(), localAnalyzeApi(env)],
  };
});
