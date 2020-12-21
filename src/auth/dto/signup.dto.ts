import { ArgsType, Field } from '@nestjs/graphql'
import { IsEmail, MinLength } from 'class-validator'

@ArgsType()
export class SignUpDto {
  @Field()
  @IsEmail()
  email: string

  @Field()
  @MinLength(4)
  password: string

  @Field()
  @MinLength(4)
  confirmPassword: string
}
