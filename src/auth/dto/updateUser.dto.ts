import { ArgsType, Field } from '@nestjs/graphql'
import { IsEmail, IsUrl, MaxLength, MinLength } from 'class-validator'

@ArgsType()
export class UpdateUserDto {
  @Field()
  @IsEmail()
  email: string

  @Field()
  @MinLength(2)
  @MaxLength(16)
  name: string

  @Field()
  @IsUrl()
  avatar_url: string
}
