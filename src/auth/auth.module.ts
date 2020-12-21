import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthService } from './auth.service'
import { AuthResolver } from './auth.resolver'
import { User } from './auth.model'
import { JwtStrategy } from './auth.strategy'
import { PassportModule } from '@nestjs/passport'
import { MailModule } from '../mail/mail.module'
import { JwtModule } from '@nestjs/jwt'
import { MemoriesConfigModule } from '../config/config.module'
import { MemoriesConfigService } from '../config/config.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
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
