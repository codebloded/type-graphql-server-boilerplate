import {
    ApolloServerPluginLandingPageDisabled,
    ApolloServerPluginLandingPageGraphQLPlayground,
} from "apollo-server-core"
import { ApolloServerExpressConfig } from "apollo-server-express"
import { buildSchema } from "type-graphql"
import { IS_PRODUCTION } from "../constants"
import { TestResolver } from "../resolver/Test.resolver"
import { AuthResolver } from "../resolver/Auth.resolver"

export const getApolloConfig =
    async (): Promise<ApolloServerExpressConfig> => ({
        schema: await buildSchema({
            resolvers: [TestResolver, AuthResolver],
        }),

        plugins: [
            IS_PRODUCTION
                ? ApolloServerPluginLandingPageDisabled()
                : ApolloServerPluginLandingPageGraphQLPlayground(),
        ],
    })
