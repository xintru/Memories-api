import { forwardRef, Module } from '@nestjs/common'
import { UserResolver } from './user.resolver'
import { UserService } from './user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './user.model'
import { AdventureModule } from '../adventure/adventure.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AdventureModule),
  ],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
