import { ArgsType, Field, Int } from '@nestjs/graphql'
import { IsNumber, IsOptional } from 'class-validator'

@ArgsType()
export class AdventuresPaginatedDto {
  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  page: number

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  limit: number
}
