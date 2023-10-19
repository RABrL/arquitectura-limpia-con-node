import { JwtAdapter } from '../../../config'
import { RegisterUserDto } from '../../dtos/auth/register-user.dto'
import { CustomError } from '../../errors/custom.error'
import { AuthRepository } from '../../repositories/auth.repository'

interface UserToken {
  token: string
  user: {
    id: string
    name: string
    email: string
  }
}

type SignTokenFunction = (
  payload: Object,
  duration?: string
) => Promise<string | null>

interface RegisterUserUseCase {
  execute(registerUserDto: RegisterUserDto): Promise<UserToken>
}

export class RegisterUser implements RegisterUserUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly signToken: SignTokenFunction = JwtAdapter.generateToken
  ) {}

  async execute(registerUserDto: RegisterUserDto): Promise<UserToken> {
    // crear usuario
    const user = await this.authRepository.register(registerUserDto)

    const { name, email, id } = user
    // token

    const token = await this.signToken({ id }, '2h')

    if (!token) throw CustomError.internalServer('Error generating token')

    return {
      token,
      user: {
        id,
        name,
        email
      }
    }
  }
}
