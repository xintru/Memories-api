import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module'
import { MemoryModule } from './memory/memory.module'
import { MailModule } from './mail/mail.module'
import { CommentModule } from './comment/comment.module'
import { ConfigModule } from '@nestjs/config'
import { MemoriesConfigService } from './config/config.service'
import { MemoriesConfigModule } from './config/config.module'
import { UserModule } from './user/user.module';

@Module({
  imports: [
    GraphQLModule.forRootAsync({
      imports: [MemoriesConfigModule],
      useExisting: MemoriesConfigService,
    }),
    TypeOrmModule.forRootAsync({
      imports: [MemoriesConfigModule],
      useExisting: MemoriesConfigService,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    MemoryModule,
    MailModule,
    CommentModule,
    ConfigModule,
    UserModule,
  ],
})
export class AppModule {}
