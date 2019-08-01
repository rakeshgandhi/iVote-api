import fs from "fs.extra";
import path from "path";
import appRoot from "app-root-path";
import { createLogger, format, transports } from "winston";

const currentDate = new Date();
const logRootDirectory = `${appRoot}/logs/`;
const errorLogDirectory = path.join(logRootDirectory, "errors");
const date = currentDate.getFullYear().toString() + ("0" + (currentDate.getMonth() + 1)).slice(-2) + ("0" + currentDate.getDate()).slice(-2);

if (!fs.existsSync(logRootDirectory)) {
    fs.mkdirp(logRootDirectory);
}

if (!fs.existsSync(errorLogDirectory)) {
    fs.mkdirp(errorLogDirectory);
}

var logFileName = path.join(logRootDirectory, `${date}.log`);
var errorLogFileName = path.join(errorLogDirectory, `${date}.log`);

const options = {
    info: {
        name: "info",
        level: "info",
        filename: logFileName,
        handleExceptions: false,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
    },
    error: {
        name: "error",
        level: "error",
        filename: errorLogFileName,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: true,
        colorize: true,
    },
};

const logFormat = format.printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

export var logger = new createLogger({
    format: format.combine(format.timestamp(), logFormat),
    transports: [
        new transports.File(options.info),
        new transports.File(options.error),
        new transports.Console(options.console)
    ],
    exitOnError: false, // do not exit on handled exceptions
});

logger.stream = {
    write: function (message, encoding) {
        logger.info(message);
    },
};

