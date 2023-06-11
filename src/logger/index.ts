import formatDate from "date-fns/format"
import { createLogger, format, transports } from "winston"

const { combine, timestamp, label, printf } = format

const customFormat = printf(
    ({ level, message, label, timestamp, durationMs }) => {
        return `${formatDate(
            new Date(timestamp),
            "yyyy-MM-dd pp"
        )} [${label}] ${level}: ${message} ${
            durationMs ? " " + ` ${durationMs / 1000}s ` : ""
        }`
    }
)

const _customFormat = (customLabel: string) =>
    combine(label({ label: customLabel }), timestamp(), customFormat)

export const createCustomLogger = (customLabel: string) => {
    return createLogger({
        level: "info",
        format: _customFormat(customLabel),
        transports:
            process.env.NODE_ENV !== "testing"
                ? [
                      new transports.File({
                          filename: "error.log",
                          level: "error",
                      }),
                      new transports.File({
                          filename: "info.log",
                          level: "info",
                      }),
                      new transports.File({ filename: "combined.log" }),
                      new transports.Console({
                          format: _customFormat(customLabel),
                      }),
                  ]
                : [
                      new transports.File({
                          filename: "error.log",
                          level: "error",
                      }),
                      new transports.File({
                          filename: "info.log",
                          level: "info",
                      }),
                      new transports.File({ filename: "combined.log" }),
                  ],
    })
}
