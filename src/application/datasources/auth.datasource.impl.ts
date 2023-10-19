import { BcryptAdapter } from '../../config'
import { UserModel } from '../../data/mongodb'
import {
  AuthDatasource,
  CustomError,
  LoginUserDto,
  RegisterUserDto,
  UserEntity
} from '../../domain'
import { UserMapper } from '../mappers/user.mapper'

type HashFunction = (password: string) => string
type CompareFunction = (password: string, hash: string) => boolean

export class AuthDatasourceImpl implements AuthDatasource {
  constructor(
    private readonly hashPassword: HashFunction = BcryptAdapter.hash,
    private readonly comparePassword: CompareFunction = BcryptAdapter.compare
  ) {}

  async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const { email, password } = loginUserDto

    try {
      // 1. Check if user already exists
      const user = await UserModel.findOne({ email })

      if (!user) throw CustomError.badRequest('Email or password incorrect')

      // 2. Compare passwords
      const isCorrectPassword = this.comparePassword(password, user.password)

      if (!isCorrectPassword)
        throw CustomError.badRequest('Email or password incorrect')

      // 3. Mapear la respuesta a nuestra entidad
      return UserMapper.userModelToEntity(user)
    } catch (error) {
      if (error instanceof CustomError) {
        throw error
      }
      throw CustomError.internalServer()
    }
  }

  async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    const { name, email, password } = registerUserDto

    try {
      // 1. Check if user already exists
      const userExists = await UserModel.findOne({ email })

      if (userExists) {
        throw CustomError.badRequest('User already exists')
      }

      const user = await UserModel.create({
        name,
        email,
        password: this.hashPassword(password)
      })

      await user.save()

      // 3. Mapear la respuesta a nuestra entidad
      return UserMapper.userModelToEntity(user)
    } catch (error) {
      if (error instanceof CustomError) {
        throw error
      }
      throw CustomError.internalServer()
    }
  }
}
