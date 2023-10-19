import { Validators } from '../../../config'

type LoginUserKeys = 'email' | 'password'

export class LoginUserDto {
  private constructor(public email: string, public password: string) {}

  static create({
    email,
    password
  }: Record<LoginUserKeys, any>): [string?, LoginUserDto?] {
    if (!email) return ['Missing email']

    if (!Validators.email.test(email)) return ['Invalid email']

    if (!password) return ['Missing password']

    if (password.length < 6) return ['Password must be at least 6 characters']

    return [undefined, new LoginUserDto(email.toLowerCase(), password)]
  }
}
