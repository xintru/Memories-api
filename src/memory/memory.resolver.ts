import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Memory } from './memory.model'
import { MemoryService } from './memory.service'
import { GqlAuthGuard } from '../auth/auth.guard'
import { UseGuards } from '@nestjs/common'
import { CurrentUser } from '../shared/decorators/CurrentUser.decorator'
import { User } from '../user/user.model'
import { MemoryDto } from './dto/memory.dto'
import { MemoriesPaginatedDto } from './dto/memories-paginated.dto'

@Resolver(() => Memory)
export class MemoryResolver {
  constructor(private readonly memoryService: MemoryService) {}

  @Query(() => [Memory])
  @UseGuards(GqlAuthGuard)
  async allMemories(@Args() memoriesPaginatedDto: MemoriesPaginatedDto) {
    return await this.memoryService.getAllMemories(memoriesPaginatedDto)
  }

  @Query(() => Memory)
  @UseGuards(GqlAuthGuard)
  async getMemoryById(@Args('id') id: string) {
    return await this.memoryService.getMemoryById(id)
  }

  @Mutation(() => Memory)
  @UseGuards(GqlAuthGuard)
  async createMemory(
    @Args() newMemoryData: MemoryDto,
    @CurrentUser('user') user: User,
  ) {
    return await this.memoryService.createMemory(newMemoryData, user)
  }
}
