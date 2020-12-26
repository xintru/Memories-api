import { Field, ObjectType } from '@nestjs/graphql'
import { User } from '../../user/user.model'

@ObjectType()
export class TokenData {
  @Field()
  token: string

  @Field()
  expiresAt: number
}

@ObjectType()
export class AuthReturnData {
  @Field((type) => TokenData)
  tokenData: TokenData

  @Field((type) => User)
  user: User
}
