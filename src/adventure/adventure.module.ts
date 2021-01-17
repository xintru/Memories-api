import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AdventureService } from './adventure.service'
import { AdventureResolver } from './adventure.resolver'
import { Adventure } from './adventure.model'
import { UserModule } from '../user/user.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Adventure]),
    forwardRef(() => UserModule),
  ],
  providers: [AdventureService, AdventureResolver],
  exports: [AdventureService],
})
export class AdventureModule {}
