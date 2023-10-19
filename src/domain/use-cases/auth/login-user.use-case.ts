import { JwtAdapter } from '../../../config'
import { LoginUserDto } from '../../dtos/auth/login-user.dto'
import { CustomError } from '../../errors/custom.error'
import { AuthRepository } from '../../repositories/auth.repository'

type LoginResponse = {
  token: string
}

type SignTokenFunction = (
  payload: Object,
  duration?: string
) => Promise<string | null>

interface LoginUserUseCase {
  execute: (loginUserDto: LoginUserDto) => Promise<LoginResponse>
}

export class LoginUser implements LoginUserUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly signToken: SignTokenFunction = JwtAdapter.generateToken
  ) {}

  async execute(loginUserDto: LoginUserDto): Promise<LoginResponse> {
    const user = await this.authRepository.login(loginUserDto)

    const token = await this.signToken({ id: user.id }, '2h')

    if (!token) throw CustomError.internalServer('Error generating token')

    return {
      token
    }
  }
}
