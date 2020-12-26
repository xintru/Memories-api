import { UserResolver } from '../user.resolver'
import { UserService } from '../user.service'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { User } from '../user.model'
import { mockRepository } from '../../shared/mocks/mockRepository'
import { CurrentUserDto } from '../../shared/decorators/CurrentUser.dto'
import { UpdateUserDto } from '../dto/updateUser.dto'
import { BadRequestException } from '@nestjs/common'
import { UpdateResult } from 'typeorm'

describe('UserResolver', () => {
  let userResolver: UserResolver
  let userService: UserService
  let mockedUser: User
  let mockedGuardData: CurrentUserDto

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: mockRepository<User>(),
        },
        UserResolver,
      ],
    }).compile()
    userService = module.get<UserService>(UserService)
    userResolver = module.get<UserResolver>(UserResolver)
    mockedUser = new User()
    mockedUser.email = 'test@te.st'
    mockedUser.password = 'my_password'
    mockedGuardData = new CurrentUserDto()
    mockedGuardData.email = 'correct@email.com'
  })

  it('should be defined', () => {
    expect(userResolver).toBeDefined()
  })

  describe('me', () => {
    it('should be defined', () => {
      expect(userResolver.me).toBeDefined()
    })

    it('should return a user', async () => {
      jest
        .spyOn(userService, 'getUserByEmail')
        .mockImplementation(() => Promise.resolve(mockedUser))
      expect(await userResolver.me(mockedGuardData)).toBe(mockedUser)
    })

    it('should delete password before responding', async () => {
      jest
        .spyOn(userService, 'getUserByEmail')
        .mockImplementation(() => Promise.resolve(mockedUser))
      expect(await userResolver.me(mockedGuardData)).not.toHaveProperty(
        'password',
      )
    })
  })

  describe('updateUser', () => {
    it('should be defined', () => {
      expect(userResolver.updateUser).toBeDefined()
    })

    it('should throw if there is no such user', async () => {
      const updateDto: UpdateUserDto = {
        email: 'some@ema.il',
        name: 'some name',
        avatar_url: '',
      }
      jest
        .spyOn(userService, 'getUserByEmail')
        .mockImplementation(() => Promise.resolve(null))
      try {
        await userResolver.updateUser(updateDto, mockedGuardData)
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException)
      }
    })

    it('should throw if wrong user email is provided', async () => {
      const updateDto: UpdateUserDto = {
        email: 'some@ema.il',
        name: 'some name',
        avatar_url: '',
      }
      jest
        .spyOn(userService, 'getUserByEmail')
        .mockImplementation(() => Promise.resolve(mockedUser))
      try {
        await userResolver.updateUser(updateDto, mockedGuardData)
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException)
      }
    })

    it('should return true if user was updated', async () => {
      const updateDto: UpdateUserDto = {
        email: 'correct@email.com',
        name: 'some name',
        avatar_url: '',
      }
      jest.spyOn(userService, 'getUserByEmail').mockImplementation(() =>
        Promise.resolve({
          ...mockedUser,
          email: 'correct@email.com',
        } as User),
      )
      const updateUserRes = new UpdateResult()
      updateUserRes.affected = 1
      jest
        .spyOn(userService, 'updateUser')
        .mockImplementation(() => Promise.resolve(updateUserRes))
      expect(await userResolver.updateUser(updateDto, mockedGuardData)).toBe(
        true,
      )
    })
  })
})
