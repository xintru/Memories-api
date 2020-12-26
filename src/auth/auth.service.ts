import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { ConfigService } from '@nestjs/config'
import { MailService } from '../mail/mail.service'
import { ChangePasswordDto } from './dto/changePassword.dto'
import { UserService } from '../user/user.service'
import { User } from '../user/user.model'

@Injectable()
export class AuthService {
  constructor(
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  createToken({ id, email }: User) {
    return this.jwtService.sign({ id, email })
  }

  async hashPassword(password: string) {
    const saltSize = this.configService.get('PASSWORD_SALT')
    try {
      return await bcrypt.hash(password, +saltSize)
    } catch (e) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async comparePasswords(password: string, hashedPassword: string) {
    try {
      return await bcrypt.compare(password, hashedPassword)
    } catch (e) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async sendNewPassword(email: string) {
    await this.mailService.sendForgotPasswordEmail({ email })
  }

  async rewritePassword(user: User, newPwData: ChangePasswordDto) {
    try {
      const userFromDb = await this.userService.getUserByEmail(user.email)
      await this.jwtService.verify(newPwData.token, {
        secret: process.env.JWT_MAIL_SECRET,
      })
      userFromDb.password = await this.hashPassword(newPwData.password)
      return await userFromDb.save()
    } catch (e) {
      throw new HttpException(
        'Could not change password, try again later!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}
