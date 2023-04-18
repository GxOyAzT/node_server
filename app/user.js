const userRepo = require('../services/repos/user-repo');
var mongo = require('mongodb');
const serviceResponse = require('../models/service-response');
var jwt = require('jsonwebtoken');
const dayjs = require('dayjs');

const register = async user => {
  if (!user.email) return serviceResponse(400, {}, 'Email cannot be empty.');

  if (!user.password)
    return serviceResponse(400, {}, 'Password is required to register.');

  if (user.password.length < 5)
    return serviceResponse(
      400,
      {},
      'Password has to be at least 5 characters.'
    );

  var findByEmailResult = await userRepo.find({
    email: user.email,
  });

  if (findByEmailResult.isSuccess)
    return serviceResponse(400, {}, 'Email is already taken.');

  var result = await userRepo.create({
    email: user.email,
    password: user.password,
    active: false,
    username: '',
    friends: [],
    nativeLang: '',
  });

  if (!result.isSuccess)
    return serviceResponse(
      400,
      {},
      'Cannot register new user. Database error.'
    );

  return serviceResponse(200, {}, '');
};

const getUserById = async user_id => {
  var result = await userRepo.find({
    _id: new mongo.ObjectID(user_id),
  });

  if (!result.isSuccess) return serviceResponse(404, {}, 'Cannot find user.');

  result.data.password = {};

  return serviceResponse(200, result.data, '');
};

const login = async (resApi, user) => {
  const findUser = await userRepo.find({
    email: user.email,
    password: user.password,
  });

  if (!findUser.isSuccess) {
    return serviceResponse(400, {}, 'Invalid email or password');
  }

  const token = jwt.sign(
    { user_id: findUser.data._id },
    'SOME93855447stodDBshsHD643DhhD7'
  );

  resApi.cookie('token', token, {
    secure: false,
    httpOnly: true,
    expires: dayjs().add(7, 'days').toDate(),
  });

  findUser.data.password = '';

  return serviceResponse(200, findUser.data, '');
};

const logout = async res => {
  res.cookie('token', '', {
    secure: false,
    httpOnly: true,
    expires: newDate(),
  });

  return serviceResponse(200, { loggedin: false }, '');
};

const changeUsername = async (user_id, username) => {
  if (!username) return serviceResponse(400, {}, 'Username cannot be empty.');

  const userByUsernameResult = await userRepo.find({
    username: username,
  });

  if (userByUsernameResult.isSuccess)
    return serviceResponse(400, {}, 'This username is already taken.');

  const userByIdResult = await userRepo.find({
    _id: new mongo.ObjectID(user_id),
  });

  let user = userByIdResult.data;

  user.username = username;

  const updateResult = await userRepo.updateUsername(user);

  if (!updateResult.isSuccess)
    return serviceResponse(400, {}, 'Cannot update username.');

  return serviceResponse(200, user, '');
};

module.exports = { register, getUserById, login, logout, changeUsername };
