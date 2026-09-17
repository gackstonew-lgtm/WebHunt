import { config } from "dotenv";
config();
import { gateway } from "./lib/ai/gateway";
import { AICapability } from "./lib/ai/core/types";

async function main() {
  console.log("Gateway configured:", gateway.isAIConfigured());

  try {
    const res = await gateway.generate({
      messages: [{ role: "user", content: "Say hello!" }],
      requiredCapabilities: [AICapability.TEXT]
    }, "FASTEST");
    console.log("Success:", res.model, res.provider);
  } catch (e) {
    console.log("Generation error:", e);
  }
}

main();
