import { Arg, Mutation, Resolver } from "type-graphql"
import { UserAuthSessionModel } from "../entities/UserAuthSession.entity"

@Resolver()
export class AuthResolver {
    @Mutation(() => Boolean)
    async login(
        @Arg("email") email: string,
        @Arg("password") password: string
    ) {
        try {
            const session = await UserAuthSessionModel.create({
                userId: "6481d0d2e9845f16a8bf0643",
                ip: "123",
                loggedInAt: new Date(),
                loggedOutAt: new Date(),
            })
            const x = {
                session,
                loggedIn: true,
                email: email,
                password: password,
            }
            console.log(x)
        } catch (e) {
            console.log(e)
        }
        return true
    }
}
