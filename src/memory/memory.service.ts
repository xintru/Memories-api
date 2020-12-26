import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Memory } from './memory.model'
import { User } from '../user/user.model'
import { MemoryDto } from './dto/memory.dto'
import { MemoriesPaginatedDto } from './dto/memories-paginated.dto'

@Injectable()
export class MemoryService {
  constructor(
    @InjectRepository(Memory)
    private readonly memoryRepository: Repository<Memory>,
  ) {}

  getAllMemories({ limit = 0, page = 1 }: MemoriesPaginatedDto) {
    const skippedItems = (page - 1) * limit

    return this.memoryRepository
      .createQueryBuilder('memory')
      .leftJoinAndSelect('memory.user', 'user')
      .orderBy('memory.created', 'DESC')
      .offset(skippedItems)
      .limit(limit)
      .getMany()
  }

  getMemoryById(memoryId: string) {
    return this.memoryRepository.findOne(memoryId, {
      relations: ['user', 'comments', 'comments.user'],
    })
  }

  createMemory(newMemoryData: MemoryDto, user: User) {
    return this.memoryRepository
      .create({
        ...newMemoryData,
        user: [user],
        comments: [],
      })
      .save()
  }
}
