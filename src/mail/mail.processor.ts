import { MailerService } from '@nestjs-modules/mailer'
import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'
import { ForgotPasswordDto } from './dto/forgotPassword.dto'
import { JwtService } from '@nestjs/jwt'

@Processor(process.env.MAIL_QUEUE_NAME)
export class MailProcessor {
  private readonly logger = new Logger(this.constructor.name)

  constructor(
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
  ) {}

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.debug(
      `Processing job ${job.id} of type ${job.name}. Data: ${JSON.stringify(
        job.data,
      )}`,
    )
  }

  @OnQueueCompleted()
  onComplete(job: Job, result: any) {
    this.logger.debug(
      `Completed job ${job.id} of type ${job.name}. Result: ${JSON.stringify(
        result,
      )}`,
    )
  }

  @OnQueueFailed()
  onError(job: Job<any>, error: any) {
    this.logger.error(
      `Failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack,
    )
  }

  @Process('forgotPassword')
  async sendForgotPasswordEmail(job: Job<ForgotPasswordDto>): Promise<any> {
    this.logger.log(`Sending confirmation email to '${job.data.email}'`)

    try {
      const forgotPasswordToken = await this.jwtService.sign({
        email: job.data.email,
      })
      return await this.mailerService.sendMail({
        template: 'forgotPasswordMail',
        context: {
          url: `${process.env.CLIENT_HOST}:${process.env.CLIENT_PORT}`,
          token: forgotPasswordToken,
        },
        subject: 'Changing your password',
        to: job.data.email,
      })
    } catch (error) {
      this.logger.error(
        `Failed to send confirmation email to '${job.data.email}'`,
        error.stack,
      )
      throw error
    }
  }
}
