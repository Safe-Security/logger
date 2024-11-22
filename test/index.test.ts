import { createLogger } from "logger-safe-security";

const logger = createLogger({ service: "sample" });

logger.info("This is a sample logger");
logger.info("This is a sample logger with more information", {
  planet: "Earth",
});

/* Logging the error property. */
const err = new Error("This is a sample Error");
logger.info("Error occurred while performing the operation", { error: err });

const metadataWithSensitiveData = {
  planet: "Earth",
  userEmail: "test@test.com",
  userName: "John Doe",
  userRole: "admin",
  userId: 1234567890,
  nesting: {
    userEmail: "test@test.com",
    userName: "John Doe",
    userRole: "admin",
    userId: 1234567890,
    stringified: JSON.stringify({
      userEmail: "test@test.com",
      userName: "John Doe",
      userRole: "admin",
      userId: 1234567890,
    }),
  },
  array: [
    { userEmail: "test@test.com" },
    { userName: "John Doe" },
    { userRole: "admin" },
    { userId: 1234567890 },
  ],
};

// mask the metadata
logger.info(
  "This is a sample logger with masked metadata",
  metadataWithSensitiveData
);

const loggerWithCustomMaskFields = createLogger({
  config: {
    maskFields: ["userRole"],
  },
});

loggerWithCustomMaskFields.info(
  "This is a sample logger with masked metadata",
  metadataWithSensitiveData
);
