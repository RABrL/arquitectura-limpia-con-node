import { Router } from 'express'
import { AuthController } from './controller'
import { AuthDatasourceImpl, AuthRepositoryImpl } from '../../application'

export class AuthRoutes {
  static get routes(): Router {
    const router = Router()

    const database = new AuthDatasourceImpl()
    const authRepository = new AuthRepositoryImpl(database)
    const controller = new AuthController(authRepository)

    // definir todas la rutas principales
    router.post('/login', controller.loginUser)
    router.post('/register', controller.registerUser)

    return router
  }
}
