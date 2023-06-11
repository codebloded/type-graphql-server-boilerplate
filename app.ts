import { createServer } from "http"
import { createCustomLogger } from "./src/logger"
import { configureTimezone } from "./src/utils/configureTimezone"
import express from "express"
import cors from "cors"
import {
    IS_PRODUCTION,
    MONGODB_CONNECTION_URL,
    ORIGIN,
    PORT,
    SERVER_TIMEZONE,
} from "./src/constants"
import "reflect-metadata"
import mongoose from "mongoose"
import { getApolloConfig } from "./src/config/apollo.config"
import { ApolloServer } from "apollo-server-express"

export const startApp = async () => {
    const logger = createCustomLogger("APP")
    configureTimezone()

    logger.info("initializing the app")

    const app = express()

    app.set("trust proxy", true)

    //http server
    const httpServer = createServer(app)

    //middlewares
    app.use(express.json())
    app.use(cors({ origin: ORIGIN }))
    // app.use(helmet({ contentSecurityPolicy: true }))

    //healthcheck
    app.get("/", (_, res) => res.status(200).end())

    logger.info(`using server timezone "${SERVER_TIMEZONE}"`)
    process.env.TZ = SERVER_TIMEZONE

    logger.info("initializing connection to the database")
    if (!MONGODB_CONNECTION_URL) {
        logger.error(`server error: env var MONGODB_CONNECTION_URL not found`)

        logger.info("exiting process")
        httpServer.close()
        process.exit()
    }
    mongoose.set("strictQuery", true)
    await mongoose.connect(MONGODB_CONNECTION_URL).then(() => {
        logger.info("connected to the database")
    })
    mongoose.connection.on("connected", () => {
        logger.info("connected to database successfully")
    })

    mongoose.connection.on("disconnected", () => {
        logger.info("disconnected from database")
        if (IS_PRODUCTION) {
            logger.info("exiting process")
            httpServer.close()
            process.exit()
        }
    })

    mongoose.connection.on("error", (error) => {
        logger.info(`connection to database failed: ${error.message}`)
        if (IS_PRODUCTION) {
            logger.info("exiting process")
            httpServer.close()
            process.exit()
        }
    })

    logger.info("creating apollo config")
    await getApolloConfig().then(async (config) => {
        logger.info("initializing apollo server")
        logger.profile("initialized the apollo server successfully")

        const apolloServer = new ApolloServer(config)

        await apolloServer.start().catch((error) => {
            logger.error(`failed to start apollo server: ${error.message}`)
            logger.info("exiting process")
            process.exit()
        })

        apolloServer.applyMiddleware({
            app,
            cors: false,
        })

        logger.profile("initialized the apollo server successfully")

        logger.info("initializing graphql subscription server")
        logger.profile("initialized the graphql subscription server")
        logger.profile(
            "This app not using subscription or Add subscription in this app.ts file"
        )
    })

    httpServer.on("error", (error) => {
        logger.error(`http server failed: ${error.message}`)

        logger.info("exiting process")
        process.exit()
    })

    await new Promise<void>((resolve) => {
        httpServer.listen(PORT, () => {
            logger.info(`http server up and running at port ${PORT}`)
            resolve()
        })
    })

    return httpServer
}
