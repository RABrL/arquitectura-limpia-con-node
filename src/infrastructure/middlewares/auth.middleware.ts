import { NextFunction, Request, Response } from 'express'
import { JwtAdapter } from '../../config'
import { UserModel } from '../../data/mongodb'

export class AuthMiddleware {
  static async validateJwt(req: Request, res: Response, next: NextFunction) {
    const authorization = req.header('Authorization')

    if (!authorization)
      return res.status(401).json({ error: 'No token provider' })
    
    if (!authorization.startsWith('Bearer '))
      return res.status(401).json({ error: 'Invalid Bearer token' })

    const token = authorization.split(' ')[1] ?? ''

    try {
      const payload = await JwtAdapter.validateToken<{ id: string }>(token)
      if (!payload) return res.status(401).json({ error: 'Invalid token' })

      const user = await UserModel.findById(payload.id)
      if(!user) return res.status(400).json({ error: 'User not found' })

      req.body.user = user

      next()
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: 'Internal erver error' })
    }
  }
}
