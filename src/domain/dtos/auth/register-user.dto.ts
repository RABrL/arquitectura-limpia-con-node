import { Validators } from '../../../config'

interface IRegisterUserDto {
  name: string
  email: string
  password: string
}

type RegisterProps = keyof IRegisterUserDto

export class RegisterUserDto {
  public name: string
  public email: string
  public password: string

  private constructor({ name, email, password }: IRegisterUserDto) {
    this.name = name
    this.email = email
    this.password = password
  }

  static create({
    name,
    email,
    password
  }: Record<RegisterProps, any>): [string?, RegisterUserDto?] {
    if (!name) return ['Missing name']
    if (!email) return ['Missing email']
    if (!Validators.email.test(email)) return ['Invalid email']
    if (!password) return ['Missing password']
    if (password.length < 6) return ['Password must be at least 6 characters']

    return [
      undefined,
      new RegisterUserDto({ name, email: email.toLowerCase(), password })
    ]
  }
}
