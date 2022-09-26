import winston from "winston";

const { combine, errors, timestamp, splat, json, metadata } = winston.format;

export const levels = winston.config.npm.levels;

export type Logger = winston.Logger;

export const createLogger = (
    {
        level = "info",
        service
    }: {
        level?: string;
        service?: string;
    } = { level: "info" }
): winston.Logger =>
    winston.createLogger({
        // default log level is "info"
        level,

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
                fillExcept: ["message", "level", "timestamp", "service", "type"]
            }),

            // default log format is JSON
            json()
        ),

        transports: [
            // logs will be written to console
            new winston.transports.Console({
                // catch and log `uncaughtException` events from the application
                handleExceptions: true,

                // catch and log `uncaughtRejection` events from the application
                handleRejections: true
            })
        ],

        // do not exit the process after logging an uncaughtException
        exitOnError: false,

        // generic metadata applied to all logs
        defaultMeta: { type: "application", ...(service && { service }) }
    });
