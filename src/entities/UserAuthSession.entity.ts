import { Field, ObjectType } from "type-graphql"
import { ITimestamps } from "./TImestamps.entity"
import mongoose, { Schema } from "mongoose"

export interface UserAuthSession extends ITimestamps {
    _id: string
    userId: string
    ip?: string
    loggedInAt?: Date
    loggedOutAt?: Date
}

@ObjectType()
export class UserAuthSession implements UserAuthSession {
    @Field() _id!: string
    @Field() userId!: string

    @Field({ nullable: true }) ip?: string

    @Field(() => Date) loggedInAt?: Date
    @Field(() => Date) loggedOutAt?: Date
}

const UserAuthSessionSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "Admin",
            required: true,
        },
        ip: { type: String, required: false },
        loggedInAt: { type: Date, required: false },
        loggedOutAt: { type: Date, required: false },
    },
    { timestamps: true }
)

export const UserAuthSessionModel = mongoose.model<UserAuthSession>(
    "UserAuthSession",
    UserAuthSessionSchema
)
