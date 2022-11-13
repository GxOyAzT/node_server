const userRepo = require('../services/repos/user-repo')
var mongo = require('mongodb')
const serviceResponse = require('../models/service-response')

const register = async (user) => {
  if (user.email === undefined || user.email === null || user.email === '') return serviceResponse(400, null, 'Email cannot be empty.')

  if (user.password === undefined || user.password === null) return serviceResponse(400, null, 'Password has to be at least 5 characters.')

  if (user.password.length < 5) return serviceResponse(400, null, 'Password has to be at least 5 characters.')
  
  var findByEmailResult = await userRepo.find({
    email: user.email,
  })

  if (findByEmailResult.isSuccess) return serviceResponse(400, null, 'Email is already taken.')

  var result = await userRepo.create({
    email: user.email,
    password: user.password,
    active: false
  })

  if (!result.isSuccess) return serviceResponse(400, null, 'Cannot register new user. Database error.')

  return serviceResponse(200, null, '')
}

const getUserById = async (user_id) => {
  var result = await userRepo.find({
    _id: new mongo.ObjectID(user_id)
  })

  if (!result.isSuccess) return serviceResponse(404, null, 'Cannot find user.') 

  result.data.password = null

  return serviceResponse(200, result.data, '')
}

module.exports = { register, getUserById }