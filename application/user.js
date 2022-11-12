const userRepo = require('../services/repos/user-repo')
const Response = require('../models/service-response')

const register = async (user) => {
  if (user.email === undefined || user.email === null || user.email === '') return Response(400, null, 'Email cannot be empty.')

  if (user.password === undefined || user.password === null) return Response(400, null, 'Password has to be at least 5 characters.')

  if (user.password.length < 5) return Response(400, null, 'Password has to be at least 5 characters.')
  
  var findByEmailResult = await userRepo.find({
    email: user.email,
  })

  if (findByEmailResult.isSuccess) return Response(400, null, 'Email is already taken.')

  var result = await userRepo.create({
    email: user.email,
    password: user.password,
    active: false
  })

  if (!result.isSuccess) return Response(400, null, 'Cannot register new user. Database error.')

  return Response(200, null, '')
}

module.exports = { register }