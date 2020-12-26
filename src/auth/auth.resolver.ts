import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { AuthService } from './auth.service'
import { User } from '../user/user.model'
import { HttpException, HttpStatus, UseGuards } from '@nestjs/common'
import { CurrentUser } from '../shared/decorators/CurrentUser.decorator'
import { ConfigService } from '@nestjs/config'
import { LoginDto } from './dto/login.dto'
import { SignUpDto } from './dto/signup.dto'
import { GqlAuthGuard } from './auth.guard'
import { ChangePasswordDto } from './dto/changePassword.dto'
import { UserService } from '../user/user.service'
import { AuthReturnData } from './dto/authData.dto'

@Resolver(() => AuthReturnData)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  @Mutation(() => AuthReturnData)
  async login(@Args() { email, password }: LoginDto) {
    const user = await this.userService.getUserByEmail(email)
    if (!user) {
      return new HttpException(
        'User with this email does not exist or password is incorrect',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }
    const isPasswordValid = await this.authService.comparePasswords(
      password,
      user.password,
    )
    if (!isPasswordValid) {
      return new HttpException(
        'User with this email does not exist or password is incorrect',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }
    const userWithoutPassword = { ...user }
    delete userWithoutPassword.password
    const token = this.authService.createToken(user)
    return {
      tokenData: {
        token,
        expiresAt: +this.configService.get('JWT_EXPIRES_AT'),
      },
      user: userWithoutPassword,
    }
  }

  @Mutation(() => AuthReturnData)
  async signup(@Args() { password, confirmPassword, email }: SignUpDto) {
    if (password !== confirmPassword) {
      return new HttpException(
        'Passwords do not match',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }
    const dbPassword = await this.authService.hashPassword(password)
    const existingUser = await this.userService.getUserByEmail(email)
    if (existingUser) {
      return new HttpException(
        'User with this email already exists',
        HttpStatus.BAD_REQUEST,
      )
    }
    const name = email.split('@')[0]
    const user = await this.userService.createUser(email, dbPassword, name)
    const userWithoutPassword = { ...user }
    delete userWithoutPassword.password
    const token = this.authService.createToken(user)
    return {
      tokenData: {
        token,
        expiresAt: this.configService.get('JWT_EXPIRES_AT'),
      },
      user: userWithoutPassword,
    }
  }

  @Mutation(() => Boolean)
  async forgotPassword(@Args('email') email: string) {
    const user = await this.userService.getUserByEmail(email)
    if (!user) {
      return new HttpException(
        'User with this email does not exist.',
        HttpStatus.BAD_REQUEST,
      )
    }
    try {
      await this.authService.sendNewPassword(user.email)
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async changePassword(
    @Args() changePasswordData: ChangePasswordDto,
    @CurrentUser('user') user: User,
  ) {
    return this.authService.rewritePassword(user, changePasswordData)
  }
}
