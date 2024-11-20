import { createLogger } from "logger-safe-security";
const logger = createLogger({ service: "sample" });

logger.info("This is a sample logger");
logger.info("This is a sample logger with more information", {
  planet: "Earth",
});

/* Logging the error property. */
const err = new Error("This is a sample Error");
logger.info("Error occurred while performing the operation", { error: err });
