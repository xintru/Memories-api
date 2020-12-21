import { Args, Mutation, Resolver, Subscription } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { GqlAuthGuard } from '../auth/auth.guard'
import { CurrentUser } from '../shared/decorators/CurrentUser.decorator'
import { User } from '../auth/auth.model'
import { NewCommentDto } from './dto/new-comment.dto'
import { Comment } from './comment.model'
import { PubSub } from 'graphql-subscriptions'
import { CommentService } from './comment.service'

const pubSub = new PubSub()

@Resolver(() => Comment)
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  @Mutation((returns) => Comment)
  @UseGuards(GqlAuthGuard)
  async addComment(
    @CurrentUser('user') user: User,
    @Args() newCommentDto: NewCommentDto,
  ) {
    const newComment = this.commentService.addComment(newCommentDto, user)
    pubSub.publish('commentAdded', { commentAdded: newComment })
    return newComment
  }

  @Subscription(() => Comment)
  commentAdded() {
    return pubSub.asyncIterator('commentAdded')
  }
}
