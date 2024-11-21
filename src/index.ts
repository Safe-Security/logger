import winston from "winston";

import { MaskInput } from "./types";
import mask from "./utils/mask";

const { combine, errors, timestamp, splat, json, metadata } = winston.format;

export const levels = winston.config.npm.levels;

export type Logger = winston.Logger;

interface ParameterConfig {
  [key: string]: {
    /**
     * Refers the return value of a custom method, in case a value is not found, it should throw an error
     * to be able to use the fallback value instead
     */
    valueFromMethod: <T>(arg: string) => T;
    /**
     * This value will be used if the function passed to the valueFromMethod throws an Exception
     */
    fallback?: string;
  };
}
interface ConfigParams {
  parameters?: ParameterConfig;
  maskFields?: string[];
}

const maskMeta = (maskFields?: string[]) =>
  winston.format((info) => {
    const parsedInfo = JSON.parse(JSON.stringify(info)) as typeof info & {
      metadata: MaskInput;
    };
    const metadata = parsedInfo.metadata || {};
    if (metadata) {
      parsedInfo.metadata = mask(metadata, maskFields);
      return parsedInfo;
    }
    return info;
  });

/* A custom format that is used to format the error object. */
const formatError = winston.format((info) => {
  if ("error" in info && info.error instanceof Error) {
    const {
      error: { message, stack, ...rest },
    } = info;
    info.error = { message, stack, ...rest };
  }

  return info;
});

/* A custom format that is used to include config parameters. */
const formatConfigParams = (parameters: ParameterConfig | undefined) => {
  return winston.format((info) => {
    if (parameters) {
      Object.keys(parameters).forEach((key) => {
        if (parameters[key]) {
          const { valueFromMethod, fallback } = parameters[key];
          try {
            if (
              typeof valueFromMethod === "function" &&
              typeof valueFromMethod<string>(key) === "string"
            ) {
              info[key] = valueFromMethod<string>(key);
            }
          } catch (error) {
            if (fallback) {
              info[key] = fallback;
            }
          }
        }
      });
    }

    return info;
  });
};

export const createLogger = (
  {
    logLevel = "info",
    service,
    config,
  }: {
    logLevel?: string;
    service?: string;
    config?: ConfigParams | undefined;
  } = { logLevel: "info" }
): winston.Logger => {
  const parameters = config && config.parameters;

  return winston.createLogger({
    // default log level is "info"
    level: logLevel,

    // combining multiple formats to get the desired output
    format: combine(
      // required to log errors thrown by the application; ignored otherwise
      errors({ stack: true }),

      // adds timestamp to all log messages
      timestamp(),

      // enables string interpolation of messages
      splat(),

      // moves all the other fields in the message to `metadata` property
      metadata({
        fillExcept: [
          "message",
          "level",
          "timestamp",
          "service",
          "type",
          "error",
        ],
      }),

      // mask the metadata
      maskMeta(config?.maskFields)(),

      // custom formatter to format the "error" property
      formatError(),

      // custom formatter to format the config parameters
      formatConfigParams(parameters)(),

      // default log format is JSON
      json()
    ),

    transports: [
      // logs will be written to console
      new winston.transports.Console({
        // catch and log `uncaughtException` events from the application
        handleExceptions: true,

        // catch and log `uncaughtRejection` events from the application
        handleRejections: true,
      }),
    ],

    // do not exit the process after logging an uncaughtException
    exitOnError: false,

    // generic metadata applied to all logs
    defaultMeta: { type: "application", ...(service && { service }) },
  });
};
