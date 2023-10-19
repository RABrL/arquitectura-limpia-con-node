import { Router } from 'express'
import { AuthController } from './controller'
import { AuthDatasourceImpl, AuthRepositoryImpl } from '../../application'
import { AuthMiddleware } from '../middlewares/auth.middleware'

export class AuthRoutes {
  static get routes(): Router {
    const router = Router()

    const database = new AuthDatasourceImpl()
    const authRepository = new AuthRepositoryImpl(database)
    const controller = new AuthController(authRepository)

    // definir todas la rutas principales
    router.post('/login', controller.loginUser)
    router.post('/register', controller.registerUser)

    router.get('/', AuthMiddleware.validateJwt, controller.getUsers)

    return router
  }
}
