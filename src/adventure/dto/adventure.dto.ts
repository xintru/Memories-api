import { ArgsType, Field } from '@nestjs/graphql'
import { MaxLength, MinLength } from 'class-validator'

@ArgsType()
export class AdventureDto {
  @Field()
  @MinLength(2)
  @MaxLength(24)
  name: string

  @Field()
  description: string
}
