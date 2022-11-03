const dbProvider = require('../db/mongo-connection')

const create = async (folder) => {
  const db = await dbProvider()
  var result = await db.collection('folder').insertOne(folder)
  return {
    isSuccess: true,
    error: '',
    data: null
  }
}

module.exports = { create }