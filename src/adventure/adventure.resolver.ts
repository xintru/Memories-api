import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'
import { Adventure } from './adventure.model'
import { AdventureService } from './adventure.service'
import { GqlAuthGuard } from '../auth/auth.guard'
import { UseGuards } from '@nestjs/common'
import { CurrentUser } from '../shared/decorators/CurrentUser.decorator'
import { User } from '../user/user.model'
import { AdventureDto } from './dto/adventure.dto'
import { UserService } from '../user/user.service'

@Resolver(() => Adventure)
export class AdventureResolver {
  constructor(
    private readonly adventureService: AdventureService,
    private readonly userService: UserService,
  ) {}

  @Query(() => Adventure)
  @UseGuards(GqlAuthGuard)
  async getAdventureById(@Args('id') id: string) {
    return await this.adventureService.getAdventureById(id)
  }

  @Mutation(() => Adventure)
  @UseGuards(GqlAuthGuard)
  async createAdventure(
    @Args() newAdventureData: AdventureDto,
    @CurrentUser('user') user: User,
  ) {
    return await this.adventureService.createAdventure(newAdventureData, user)
  }

  @ResolveField()
  async users(@Parent() adventure: Adventure) {
    return await this.userService.getAllAdventureUsers(adventure.id)
  }
}
