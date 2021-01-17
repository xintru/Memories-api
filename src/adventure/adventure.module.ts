import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AdventureService } from './adventure.service'
import { AdventureResolver } from './adventure.resolver'
import { Adventure } from './adventure.model'

@Module({
  imports: [TypeOrmModule.forFeature([Adventure])],
  providers: [AdventureService, AdventureResolver],
})
export class AdventureModule {}
