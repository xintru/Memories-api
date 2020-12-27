import { AuthResolver } from '../auth.resolver'
import { AuthService } from '../auth.service'
import { UserService } from '../../user/user.service'
import { Test, TestingModule } from '@nestjs/testing'
import { User } from '../../user/user.model'
import { CurrentUserDto } from '../../shared/decorators/CurrentUser.dto'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { MemoriesConfigModule } from '../../config/config.module'
import { MemoriesConfigService } from '../../config/config.service'
import { MailModule } from '../../mail/mail.module'
import { getRepositoryToken } from '@nestjs/typeorm'
import { mockRepository } from '../../shared/mocks/mockRepository'
import { LoginDto } from '../dto/login.dto'
import {
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { AuthReturnData } from '../dto/authData.dto'
import { SignUpDto } from '../dto/signup.dto'

describe('AuthResolver', () => {
  let authResolver: AuthResolver
  let userService: UserService
  let configService: ConfigService
  let mockedUser: User
  let mockedGuardData: CurrentUserDto
  let saltSize: number

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.registerAsync({
          imports: [MemoriesConfigModule],
          useExisting: MemoriesConfigService,
        }),
        MailModule,
      ],
      providers: [
        AuthResolver,
        AuthService,
        ConfigService,
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: mockRepository<User>(),
        },
      ],
    }).compile()
    userService = module.get<UserService>(UserService)
    authResolver = module.get<AuthResolver>(AuthResolver)
    configService = module.get<ConfigService>(ConfigService)
    mockedUser = new User()
    mockedUser.email = 'email@email.com'
    saltSize = configService.get('PASSWORD_SALT')
    mockedUser.password = await bcrypt.hash('12345', +saltSize)
    mockedGuardData = new CurrentUserDto()
    mockedGuardData.email = 'correct@email.com'
  })

  it('should be defined', () => {
    expect(authResolver).toBeDefined()
  })

  describe('login', () => {
    const loginData = new LoginDto()

    beforeEach(() => {
      loginData.email = 'email@email.com'
      loginData.password = '12345'
    })

    it('should be defined', () => {
      expect(authResolver.login).toBeDefined()
    })

    it('throws if such user does not exist', async () => {
      jest
        .spyOn(userService, 'getUserByEmail')
        .mockImplementation(() => undefined)
      try {
        await authResolver.login(loginData)
      } catch (error) {
        expect(error).toBeInstanceOf(UnprocessableEntityException)
      }
    })

    it('throws if password is wrong', async () => {
      mockedUser.password = 'wrong'
      jest
        .spyOn(userService, 'getUserByEmail')
        .mockImplementation(() => Promise.resolve(mockedUser))
      try {
        await authResolver.login(loginData)
      } catch (error) {
        expect(error).toBeInstanceOf(UnprocessableEntityException)
      }
    })

    const login = (): Promise<AuthReturnData> => {
      jest
        .spyOn(userService, 'getUserByEmail')
        .mockImplementation(() => Promise.resolve(mockedUser))
      return authResolver.login(loginData) as Promise<AuthReturnData>
    }

    it('returns tokenData and user', async () => {
      const result = await login()
      expect(result).toHaveProperty('tokenData')
      expect(result).toHaveProperty('user')
    })

    it('returns jwt and expiration time', async () => {
      const result = await login()
      expect(result.tokenData.expiresAt).toBe(
        +configService.get('JWT_EXPIRES_AT'),
      )
      expect(result.tokenData).toHaveProperty('token')
    })

    it('erases the password in user return data', async () => {
      const result = await login()
      expect(result.user).not.toHaveProperty('password')
    })
  })

  describe('signup', () => {
    const signupData = new SignUpDto()

    beforeEach(() => {
      signupData.email = 'email@email.com'
      signupData.password = '12345'
      signupData.confirmPassword = '12345'
    })

    it('should be defined', () => {
      expect(authResolver.signup).toBeDefined()
    })

    it('should throw if password do not match', async () => {
      signupData.confirmPassword = '123456'
      try {
        await authResolver.signup(signupData)
      } catch (error) {
        expect(error).toBeInstanceOf(UnprocessableEntityException)
      }
    })

    it('throws if user already exists', async () => {
      jest
        .spyOn(userService, 'getUserByEmail')
        .mockImplementation(() => Promise.resolve(mockedUser))
      try {
        await authResolver.signup(signupData)
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException)
      }
    })

    const signUp = (): Promise<AuthReturnData> => {
      jest
        .spyOn(userService, 'getUserByEmail')
        .mockImplementation(() => undefined)
      jest
        .spyOn(userService, 'createUser')
        .mockImplementation(() => Promise.resolve(mockedUser))
      return authResolver.signup(signupData) as Promise<AuthReturnData>
    }

    it('returns tokenData and user', async () => {
      const result = await signUp()
      expect(result).toHaveProperty('tokenData')
      expect(result).toHaveProperty('user')
    })

    it('returns jwt and expiration time', async () => {
      const result = await signUp()
      expect(result.tokenData.expiresAt).toBe(
        +configService.get('JWT_EXPIRES_AT'),
      )
      expect(result.tokenData).toHaveProperty('token')
    })

    it('erases the password in user return data', async () => {
      const result = await signUp()
      expect(result.user).not.toHaveProperty('password')
    })
  })
})
