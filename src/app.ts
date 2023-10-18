import { envs } from './config'
import { MongoDatabase } from './data/mongodb'
import { AppRoutes } from './infrastructure/routes'
import { Server } from './infrastructure/server'
;(() => {
  main()
})()

async function main() {
  // todo: await base de datos
  await MongoDatabase.connect({
    mongoUrl: envs.MONGO_URL,
    dbName: envs.MONGO_DBNAME
  })
  // todo: inicio de nuestro server
  new Server({
    port: envs.PORT,
    routes: AppRoutes.routes
  }).start()
}
