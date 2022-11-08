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

const find = async (filter) => {
  const db = await dbProvider()
  var result = await db.collection('folder').findOne(filter)

  if (result === null) return {
    isSuccess: false,
    error: 'Cannot find folder.',
    data: null
  }

  return {
    isSuccess: true,
    error: '',
    data: result
  }
}

const update = async (folder) => {
  const db = await dbProvider()
  var result = await db.collection('folder').replaceOne({ _id: folder._id }, folder, { upsert: true } )

  if (result === null) return {
    isSuccess: false,
    error: 'Cannot update folder.',
    data: null
  }

  return {
    isSuccess: true,
    error: '',
    data: result
  }
}

module.exports = { create, find, update }