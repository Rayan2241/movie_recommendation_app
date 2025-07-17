import mongoose from "mongoose";
import winston from "winston";

// Set up the logger
const logger = winston.createLogger({
  level: "info", // Log level (info, warn, error)
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(), // Log to console
  ],
});

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI!);
    logger.info(`MongoDB Connected: ${conn.connection.host}`); // Using logger
  } catch (error) {
    logger.error("Database connection error: " + (error as Error).message); // Using logger for error
    process.exit(1);
  }
};

export default connectDB;
