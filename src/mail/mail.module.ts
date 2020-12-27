import { Module } from '@nestjs/common'
import { MailService } from './mail.service'
import { MailProcessor } from './mail.processor'
import { MailerModule } from '@nestjs-modules/mailer'
import { BullModule } from '@nestjs/bull'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: process.env.MAILER_TRANSPORT,
        defaults: {
          from: process.env.MAILER_FROM,
        },
        template: {
          dir: __dirname + '/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    BullModule.registerQueueAsync({
      name: process.env.MAIL_QUEUE_NAME,
      useFactory: () => ({
        redis: {
          host: process.env.REDIS_HOST,
          port: +process.env.REDIS_PORT,
        },
      }),
    }),
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWT_MAIL_SECRET,
      }),
    }),
  ],
  controllers: [],
  providers: [MailService, MailProcessor],
  exports: [MailService],
})
export class MailModule {}
