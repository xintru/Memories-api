import { UserService } from '../user.service'
import { User } from '../user.model'
import { CurrentUserDto } from '../../shared/decorators/CurrentUser.dto'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { mockRepository } from '../../shared/mocks/mockRepository'
import { UpdateUserDto } from '../dto/updateUser.dto'

describe('UserService', () => {
  let userService: UserService
  let mockedUser: User
  let mockedGuardData: CurrentUserDto

  beforeEach(async () => {
    mockedUser = new User()
    mockedUser.email = 'test@te.st'
    mockedUser.name = 'george'
    mockedUser.password = 'my_password'
    mockedGuardData = new CurrentUserDto()
    mockedGuardData.email = 'correct@email.com'
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: mockRepository<User>(mockedUser),
        },
      ],
    }).compile()
    userService = module.get<UserService>(UserService)
  })

  it('should be defined', () => {
    expect(userService).toBeDefined()
  })

  it('creates a new user', async () => {
    const user = await userService.createUser(
      'new@email.com',
      '12345',
      'george',
    )
    expect(user.email).toBe('new@email.com')
  })

  it('updates a user', async () => {
    const updateDto: UpdateUserDto = {
      email: 'some@ema.il',
      name: 'some name',
      avatar_url: '',
    }
    const res = await userService.updateUser(mockedUser, updateDto)
    expect(res.affected).toBeGreaterThanOrEqual(1)
  })

  it('finds a user by email', async () => {
    const user = await userService.getUserByEmail(mockedUser.email)
    expect(user.name).toBe(mockedUser.name)
  })
})
