import { Injectable } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'
import { ForgotPasswordDto } from './dto/forgotPassword.dto'

@Injectable()
export class MailService {
  constructor(
    @InjectQueue(process.env.MAIL_QUEUE_NAME)
    private mailQueue: Queue,
  ) {}

  async sendForgotPasswordEmail(data: ForgotPasswordDto): Promise<boolean> {
    try {
      await this.mailQueue.add('forgotPassword', data)
      return true
    } catch (error) {
      // this.logger.error(`Error queueing confirmation email to user ${user.email}`)
      return false
    }
  }
}
