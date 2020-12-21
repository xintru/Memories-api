import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './auth.model'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { ConfigService } from '@nestjs/config'
import { MailService } from '../mail/mail.service'
import { ChangePasswordDto } from './dto/changePassword.dto'
import { UpdateUserDto } from './dto/updateUser.dto'

const cloudinary = require('cloudinary')

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  createToken({ id, email }: User) {
    return this.jwtService.sign({ id, email })
  }

  createUser(email: string, password: string, name: string) {
    return this.userRepo
      .create({ email, password, name, memories: [], comments: [] })
      .save()
  }

  updateUser(user: User, updateUserDto: UpdateUserDto) {
    if (user.avatar_url) {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      })
      cloudinary.v2.uploader.destroy(
        user.avatar_url.split('/').reverse()[0].split('.')[0],
      )
    }

    return this.userRepo.update(user.id, updateUserDto)
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

  getUserByEmail(email: string) {
    return this.userRepo.findOne(
      { email },
      {
        relations: [
          'memories',
          'comments',
          'memories.comments',
          'comments.memory',
        ],
      },
    )
  }

  async sendNewPassword(email: string) {
    await this.mailService.sendForgotPasswordEmail({ email })
  }

  async rewritePassword(user: User, newPwData: ChangePasswordDto) {
    try {
      const userFromDb = await this.getUserByEmail(user.email)
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
