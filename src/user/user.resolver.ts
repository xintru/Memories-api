import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'
import { User } from './user.model'
import { BadRequestException, UseGuards } from '@nestjs/common'
import { GqlAuthGuard } from '../auth/auth.guard'
import { CurrentUser } from '../shared/decorators/CurrentUser.decorator'
import { UserService } from './user.service'
import { UpdateUserDto } from './dto/updateUser.dto'
import { CurrentUserDto } from '../shared/decorators/CurrentUser.dto'
import { Adventure } from '../adventure/adventure.model'
import { AdventureService } from '../adventure/adventure.service'

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly adventureService: AdventureService,
  ) {}

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser('user') user: CurrentUserDto) {
    const userFromDb = await this.userService.getUserByEmail(user.email)
    delete userFromDb.password
    return userFromDb
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async updateUser(
    @Args() updateUserDto: UpdateUserDto,
    @CurrentUser('user') user: CurrentUserDto,
  ) {
    const userFromDb = await this.userService.getUserByEmail(user.email)
    if (!userFromDb) {
      throw new BadRequestException('This user does not exist')
    }
    if (userFromDb.email !== user.email) {
      throw new BadRequestException('You can not update this user')
    }
    const res = await this.userService.updateUser(userFromDb, updateUserDto)
    return res.affected > 0
  }

  @ResolveField(() => [Adventure])
  async adventures(@Parent() user: User) {
    return await this.adventureService.getAllUserAdventures(user.id)
  }
}
