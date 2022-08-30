import { logger } from "logger-safe-security";
const appLogger = logger.child({ service: "sample" });

logger.info("This is a parent logger");
appLogger.info("This is a child logger");