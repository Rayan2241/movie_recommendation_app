import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import winston from "winston";
import connectDB from "./config/database";
import authRoutes from "./routes/authRoutes";
import { 
  OK, 
  NOT_FOUND, 
  INTERNAL_SERVER_ERROR, 
  BAD_REQUEST 
} from "./constants/http";
import {
  SERVER_STARTED,
  HEALTH_CHECK,
  API_WELCOME,
  ENDPOINT_NOT_FOUND,
  SERVER_ERROR,
  VALIDATION_ERROR,
  SHUTDOWN_MESSAGE,
  UNHANDLED_REJECTION
} from "./constants/messages";

dotenv.config();

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Initialize database connection
connectDB();

// Enhanced logger configuration
const logger = winston.createLogger({
  level: process.env.NODE_ENV === "development" ? "debug" : "info",
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: path.join(logsDir, 'server.log') })
  ],
});

const app = express();

// Configure CORS
const corsOptions = {
  origin: process.env.NODE_ENV === "production"
    ? [process.env.FRONTEND_PROD_URL!]
    : [process.env.FRONTEND_DEV_URL || "http://localhost:3000"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

// API Routes - Mount all routes under /api
app.use("/api", authRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(OK).json({
    status: HEALTH_CHECK,
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.status(OK).json({
    message: API_WELCOME,
    version: "1.0.0"
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(`Error: ${err.message}\nStack: ${err.stack}`);
  
  if (err.name === 'ValidationError') {
    return res.status(BAD_REQUEST).json({
      success: false,
      message: VALIDATION_ERROR,
      errors: err.errors
    });
  }

  res.status(err.status || INTERNAL_SERVER_ERROR).json({
    success: false,
    message: process.env.NODE_ENV === 'development' ? err.message : SERVER_ERROR
  });
});

// 404 handler (must be last middleware)
app.use((req, res) => {
  logger.warn(`Route not found: ${req.method} ${req.originalUrl}`);
  res.status(NOT_FOUND).json({
    success: false,
    message: ENDPOINT_NOT_FOUND
  });
});

// Server configuration
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  logger.info(`${SERVER_STARTED} ${PORT}`);
  
  console.log(`
  ===================================
  🚀 Server successfully started!
  🔗 Base URL: http://localhost:${PORT}
  ===================================
  `);
});

// Handle process events
process.on('unhandledRejection', (err: Error) => {
  logger.error(`${UNHANDLED_REJECTION}: ${err.message}`);
  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  logger.info(SHUTDOWN_MESSAGE);
  server.close(() => process.exit(0));
});