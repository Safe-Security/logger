"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = void 0;
const winston_1 = __importDefault(require("winston"));
const { combine, errors, timestamp, splat, json } = winston_1.default.format;
const createLogger = ({ logLevel = "info" }) => winston_1.default.createLogger({
    // default log level is "info"
    level: logLevel,
    // combining multiple formats to get the desired output
    format: combine(
    // required to log errors thrown by the application; ignored otherwise
    errors({ stack: true }), 
    // enables string interpolation of messages
    splat(), 
    // adds timestamp to all log messages
    timestamp(), 
    // default log format is JSON
    json()),
    transports: [
        // logs will be written to console
        new winston_1.default.transports.Console({
            // catch and log `uncaughtException` events from the application
            handleExceptions: true,
            // catch and log `uncaughtRejection` events from the application
            handleRejections: true
        })
    ],
    // generic metadata applied to all logs
    defaultMeta: { type: "application" }
});
exports.createLogger = createLogger;
