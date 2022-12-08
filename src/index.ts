import winston from "winston";

const { combine, errors, timestamp, splat, json, metadata } = winston.format;

export const levels = winston.config.npm.levels;

export type Logger = winston.Logger;

interface ParameterConfig {
    [key: string]: {
        valueFromMethod: <T>(arg: string) => T;
    };
}
interface ConfigParams {
    parameters: ParameterConfig;
}

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
const formatTenantId = (parameters: ParameterConfig | undefined) => {
    return winston.format(info => {
        info.tenantId = "";
        if (parameters && "tenantId" in parameters && parameters.tenantId) {
            const { valueFromMethod } = parameters.tenantId;
            try {
                if (
                    typeof valueFromMethod === "function" &&
                    typeof valueFromMethod<string>("tenantId") === "string"
                ) {
                    info.tenantId = valueFromMethod<string>("tenantId");
                }
            } catch (error) {
                console.error(
                    "Error occurred while getting the tenantId from the valueFromMethod, using fallback value now!"
                );
            }
        }

        return info;
    });
};

export const createLogger = (
    {
        logLevel = "info",
        service,
        config
    }: {
        logLevel?: string;
        service?: string;
        config?: ConfigParams | undefined;
    } = { logLevel: "info" }
): winston.Logger => {
    const parameters = config && config.parameters as ParameterConfig | undefined;

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
                    "error"
                ]
            }),
            // custom formatter to format the "error" property
            formatError(),

            // custom formatter to format the tenantId
            formatTenantId(parameters)(),

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
    })};
