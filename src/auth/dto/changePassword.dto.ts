import { MinLength } from 'class-validator'
import { ArgsType, Field } from '@nestjs/graphql'

@ArgsType()
export class ChangePasswordDto {
  @MinLength(4)
  @Field()
  password: string

  @Field()
  token: string
}
