import express, { Router } from 'express'

interface Options {
  port?: number
  routes: Router
}

export class Server {
  public readonly app = express()
  private readonly port: number
  private readonly routes: Router

  constructor({ port = 3100, routes }: Options) {
    this.port = port
    this.routes = routes
  }

  async start() {
    // Middlewares
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))

    // Usar las rutas definidas
    this.app.use(this.routes)

    this.app.listen(this.port, () => {
      console.log(`server running on http://localhost:${this.port}`)
    })
  }
}
