const router = require('express').Router();
const userRepo = require('../services/repos/user-repo');
const auth = require('../services/auth/auth-middleware');
var mongo = require('mongodb');
const { register, getUserById, login, changeUsername } = require('../app/user');
const {
  sendResponseBasedOnService,
} = require('../services/api/api-reponse-base-on-service');
const serviceResponse = require('../models/service-response');

router
  .route('/')
  .post(async (req, res) => {
    const { email, password } = req.body;

    return sendResponseBasedOnService(res, await register({ email, password }));
  })
  .get(auth, async (req, res) => {
    const { user_id } = req.user;

    return sendResponseBasedOnService(res, await getUserById(user_id));
  });

router
  .route('/login')
  .get(auth, async (req, res) => {
    return sendResponseBasedOnService(
      res,
      serviceResponse(200, { isLoggedIn: true }, '')
    );
  })
  .post(async (req, res) => {
    const { email, password } = req.body;

    return sendResponseBasedOnService(
      res,
      await login(res, { email, password })
    );
  })
  .delete(auth, async (req, res) => {
    return sendResponseBasedOnService(res, await logout(res));
  });

router.route('/username').patch(auth, async (req, res) => {
  const { user_id } = req.user;
  const { username } = req.body;

  return sendResponseBasedOnService(
    res,
    await changeUsername(user_id, username)
  );
});

// REMAKE THIS CODE

router.route('/friendship/:username').get(auth, async (req, res) => {
  const { username } = req.params;

  if (username === null || username === undefined || username === '')
    return res.status(400).send('Username cannot be empty.');

  var userByUsernameResult = await userRepo.find({
    username: username,
  });

  if (!userByUsernameResult.isSuccess)
    return res.status(404).send('User of passed username does not exists.');

  res.status(200).send({
    _id: userByUsernameResult.data._id,
    username: userByUsernameResult.data.username,
  });
});

router.route('/friendship').post(auth, async (req, res) => {
  const { user_id } = req.user;
  const { friend_id } = req.body;

  if (user_id === friend_id)
    res.status(400).send('You cannot add yourself as a friend.');

  var findUserResult = await userRepo.find({
    _id: new mongo.ObjectID(user_id),
  });

  if (!findUserResult.isSuccess)
    return res.status(404).send('Cannot find user.');

  const user = findUserResult.data;

  if (user.friends === undefined) user.friends = [];

  if (user.friends.find(u => u.friend_id === friend_id) != null)
    return res.status(400).send('This user is already your friend.');

  user.friends.push({
    friend_id: friend_id,
  });

  console.log(user);
  const updateResult = await userRepo.update(user);

  if (!updateResult.isSuccess)
    return res.status(400).send('Cannot update user');

  return res.status(200).send('OK');
});

module.exports = router;
