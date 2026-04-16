import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { swaggerConfig } from "./config/swagger.config.js";
import systemRoutes from "./modules/system/system.routes.js";

const app: Express = express();
const isProduction = process.env.NODE_ENV === "production";

// 1. SECURITY & LOGGING
app.use(helmet());
app.use(morgan(isProduction ? "combined" : "dev"));

// 2. CORS — update this list as you add environments
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://your-vercel-app.vercel.app", // ← update after Vercel setup
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isAllowed = allowedOrigins.some((o) => origin.startsWith(o));
      if (isAllowed) {
        callback(null, true);
      } else {
        console.error(`🔴 CORS Blocked: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 3. PARSERS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. DOCS
const specs = swaggerJsdoc(swaggerConfig);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// 5. ROUTES
const API_PREFIX = "/api/v1";
app.use(`${API_PREFIX}/system`, systemRoutes);
// ➕ Add new routes here: app.use(`${API_PREFIX}/users`, userRoutes);

// 6. START
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n-----------------------------------------`);
  console.log(`🚀 API RUNNING`);
  console.log(`🌍 MODE: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔗 HEALTH: http://localhost:${PORT}${API_PREFIX}/system/health`);
  console.log(`📖 SWAGGER: http://localhost:${PORT}/api-docs`);
  console.log(`-----------------------------------------\n`);
});

export default app;