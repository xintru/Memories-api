import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { User } from './user.model'
import { HttpException, HttpStatus, UseGuards } from '@nestjs/common'
import { GqlAuthGuard } from '../auth/auth.guard'
import { CurrentUser } from '../shared/decorators/CurrentUser.decorator'
import { UserService } from './user.service'
import { UpdateUserDto } from './dto/updateUser.dto'

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser('user') user: User) {
    const userFromDb = await this.userService.getUserByEmail(user.email)
    delete userFromDb.password
    return userFromDb
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async updateUser(
    @Args() updateUserDto: UpdateUserDto,
    @CurrentUser('user') user: User,
  ) {
    const userFromDb = await this.userService.getUserByEmail(
      updateUserDto.email,
    )
    if (userFromDb && userFromDb.email !== user.email) {
      throw new HttpException('This email is taken.', HttpStatus.BAD_REQUEST)
    }
    const res = await this.userService.updateUser(userFromDb, updateUserDto)
    return res.affected > 0
  }
}
