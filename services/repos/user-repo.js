const { ObjectID } = require('bson')
const dbProvider = require('../db/mongo-connection')

const create = async (user) => {
  const db = await dbProvider()
  var result = await db.collection('user').insertOne(user)
  return {
    isSuccess: true,
    error: '',
    data: null
  }
}

const find = async (filter) => {
  const db = await dbProvider()
  var result = await db.collection('user').findOne(filter)
  
  if (result === null) return {
    isSuccess: false,
    error: 'Cannot find user of passed email.',
    data: null
  }

  return {
    isSuccess: true,
    error: '',
    data: result
  }
}

const update = async (user) => {
  const db = await dbProvider()
  var result = await db.collection('user').updateOne({_id: new ObjectID(user._id)}, { $set: { username: user.username } })
  
  if (result === null) return {
    isSuccess: false,
    error: 'Cannot find user of passed email.',
    data: null
  }

  return {
    isSuccess: true,
    error: '',
    data: result
  }
}

module.exports = { create, find, update }