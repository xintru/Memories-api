import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Adventure } from './adventure.model'
import { AdventureDto } from './dto/adventure.dto'
import { User } from '../user/user.model'

@Injectable()
export class AdventureService {
  constructor(
    @InjectRepository(Adventure)
    private readonly adventureRepository: Repository<Adventure>,
  ) {}

  getAdventureById(adventureId: string) {
    return this.adventureRepository.findOne(adventureId)
  }

  createAdventure(newAdventureData: AdventureDto, user: User) {
    return this.adventureRepository
      .create({
        ...newAdventureData,
        user: [user],
      })
      .save()
  }
}
