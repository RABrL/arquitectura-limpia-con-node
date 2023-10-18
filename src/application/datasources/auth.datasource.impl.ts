import { BcryptAdapter } from '../../config'
import { UserModel } from '../../data/mongodb'
import {
  AuthDatasource,
  CustomError,
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
      // 2. Hash password

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
