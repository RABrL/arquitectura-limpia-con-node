import { UserModel } from '../../data/mongodb'
import { CustomError, UserEntity } from '../../domain'

export class UserMapper {
  static userModelToEntity(userModel: { [key: string]: any }): UserEntity {
    const { id, _id, name, password, roles, email, img } = userModel

    if (!id || !_id) throw CustomError.badRequest('Missing id')

    if (!name) throw CustomError.badRequest('Missing name')
    if (!email) throw CustomError.badRequest('Missing email')
    if (!password) throw CustomError.badRequest('Missing password')
    if (!roles) throw CustomError.badRequest('Missing roles')

    return new UserEntity({
      id: id || _id,
      name,
      email,
      password,
      roles,
      img
    })
  }
}
