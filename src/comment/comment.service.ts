import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Comment } from './comment.model'
import { NewCommentDto } from './dto/new-comment.dto'
import { Repository } from 'typeorm'
import { User } from '../user/user.model'
import { Memory } from '../memory/memory.model'

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Memory)
    private readonly memoryRepository: Repository<Memory>,
  ) {}

  async addComment({ memoryId, message }: NewCommentDto, user: User) {
    const memory = await this.memoryRepository.findOne({ id: memoryId })
    return this.commentRepository.create({ memory, message, user }).save()
  }
}
