import { createLogger } from "logger-safe-security";
const logger = createLogger({ service: "sample" });

logger.info("This is a sample logger");
logger.info("This is a sample logger with more information", { planet: "Earth" });