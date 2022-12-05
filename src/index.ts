import winston from "winston";

const { combine, errors, timestamp, splat, json, metadata } = winston.format;

export const levels = winston.config.npm.levels;

export type Logger = winston.Logger;

/* A custom format that is used to format the error object. */
const formatError = winston.format(info => {
    if ("error" in info && info.error instanceof Error) {
        const {
            error: { message, stack, ...rest }
        } = info;
        info.error = { message, stack, ...rest };
    }

    return info;
});

/* A custom format that is used to include tenantId. */
const formatTenantId = (tenantId: string | undefined) => {
    console.log(tenantId);
    return winston.format(info => {
    if (tenantId) {
        console.log("Here");
        const { tenantId } = info;
        info.tenantId = tenantId;
    } else {
        console.log("There");
        info.tenantId = "";
    }

    return info;
})};

export const createLogger = (
    {
        logLevel = "info",
        service,
        tenantId
    }: {
        logLevel?: string;
        service?: string;
        tenantId?: string;
    } = { logLevel: "info" }
): winston.Logger =>
    winston.createLogger({
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
                    "error"
                ]
            }),
            // custom formatter to format the "error" property
            formatError(),

            // custom formatter to format the tenantId
            formatTenantId(tenantId)(),

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
