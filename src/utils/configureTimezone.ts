import { SERVER_TIMEZONE } from "./../constants"
import { createCustomLogger } from "../logger"

export const configureTimezone = () => {
    const logger = createCustomLogger("configureTimezone")

    logger.info(`using server timezone "${SERVER_TIMEZONE}"`)
    process.env.TZ = SERVER_TIMEZONE
}
