import winston from "winston";

const { combine, errors, timestamp, splat, json } = winston.format;

export const levels = winston.config.npm.levels;

export type Logger = winston.Logger;

const formatMessageMetadata = winston.format(
    ({ message, level, service, type, ...rest }) => {
        return {
            message,
            level,
            type,
            ...(service && { service }),
            messageMetadata: rest,
            // this is required as per the winston documentation: https://github.com/winstonjs/winston#streams-objectmode-and-info-objects
            [Symbol.for("level")]: level,
            [Symbol.for("message")]: message
        };
    }
);

export const createLogger = (
    {
        logLevel = "info",
        service
    }: {
        logLevel?: string;
        service?: string;
    } = { logLevel: "info" }
): winston.Logger =>
    winston.createLogger({
        // default log level is "info"
        level: logLevel,

        // combining multiple formats to get the desired output
        format: combine(
            // moves all the other fields in the the message to `messageMetadata` property
            formatMessageMetadata(),
            
            // required to log errors thrown by the application; ignored otherwise
            errors({ stack: true }),

            // enables string interpolation of messages
            splat(),

            // adds timestamp to all log messages
            timestamp(),

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

