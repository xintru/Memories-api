import { ArgsType, Field } from '@nestjs/graphql'
import { IsString, IsUUID } from 'class-validator'

@ArgsType()
export class NewCommentDto {
  @Field()
  @IsUUID('all')
  memoryId: string

  @Field()
  @IsString()
  message: string
}
