import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthService } from './auth.service'
import { AuthResolver } from './auth.resolver'
import { User } from '../user/user.model'
import { JwtStrategy } from './auth.strategy'
import { PassportModule } from '@nestjs/passport'
import { MailModule } from '../mail/mail.module'
import { JwtModule } from '@nestjs/jwt'
import { MemoriesConfigModule } from '../config/config.module'
import { MemoriesConfigService } from '../config/config.service'
import { UserModule } from '../user/user.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UserModule,
    PassportModule,
    MailModule,
    JwtModule.registerAsync({
      imports: [MemoriesConfigModule],
      useExisting: MemoriesConfigService,
    }),
  ],
  providers: [AuthService, AuthResolver, JwtStrategy],
})
export class AuthModule {}
