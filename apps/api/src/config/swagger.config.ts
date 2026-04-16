import { Options } from "swagger-jsdoc";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const liveUrl = process.env.LIVE_URL || "https://your-app-runner-url.awsapprunner.com";

export const swaggerConfig: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Project API",
      version: "1.0.0",
      description: "API Documentation",
    },
    servers: [
      { url: "http://localhost:3001", description: "Development (Local)" },
      { url: liveUrl, description: "Production (AWS App Runner)" },
    ],
  },
  apis: [
    path.resolve(__dirname, "../modules/**/*.routes.{ts,js}"),
    path.resolve(__dirname, "../modules/**/*.controller.{ts,js}"),
  ],
};