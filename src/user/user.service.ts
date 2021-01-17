import { Injectable } from '@nestjs/common'
import { UpdateUserDto } from './dto/updateUser.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './user.model'
import { Adventure } from '../adventure/adventure.model'

const cloudinary = require('cloudinary')

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  createUser(email: string, password: string, name: string) {
    return this.userRepo.save({
      email,
      password,
      name,
      adventures: [],
    })
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

  getUserByEmail(email: string) {
    return this.userRepo.findOne({ email })
  }

  getAllAdventureUsers(adventureId: string) {
    return this.userRepo
      .createQueryBuilder()
      .relation(Adventure, 'users')
      .of(adventureId)
      .loadMany()
  }
}
