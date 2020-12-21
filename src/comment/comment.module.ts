import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Comment } from './comment.model'
import { CommentService } from './comment.service'
import { CommentResolver } from './comment.resolver'
import { Memory } from '../memory/memory.model'

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Memory])],
  providers: [CommentService, CommentResolver],
})
export class CommentModule {}
