const MongoClient = require('mongodb').MongoClient;

const connectionString = 'mongodb+srv://flashitclient:FlashItClient1@flashit.vb8uf3z.mongodb.net/?retryWrites=true&w=majority'

const dbProvider = async () => {
  const client = await MongoClient.connect(connectionString)
  const db = client.db('flashit')
  return db
}

module.exports = dbProvider