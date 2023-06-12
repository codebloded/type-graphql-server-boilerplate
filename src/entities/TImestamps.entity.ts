import { Field, ObjectType } from "type-graphql"

export interface ITimestamps {
    createdAt: Date
    updatedAt: Date
}

@ObjectType()
export class Timestamps implements ITimestamps {
    @Field(() => Date) createdAt!: Date
    @Field(() => Date) updatedAt!: Date
}
