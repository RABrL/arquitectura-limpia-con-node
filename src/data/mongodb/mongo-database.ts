import mongoose from 'mongoose'

interface Options {
  mongoUrl: string
  dbName: string
}

export class MongoDatabase {
  static async connect({ dbName, mongoUrl }: Options) {
    try {
      await mongoose.connect(mongoUrl, {
        dbName
      })
      console.log('Mongo connected')
      return true
    } catch (error) {
      console.log('Mongo connection error')
      throw error
    }
  }
}
