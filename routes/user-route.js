const router = require('express').Router()
const userRepo = require('../services/repos/user-repo')
var jwt = require('jsonwebtoken');
const auth = require("../services/auth/auth-middleware")
var mongo = require('mongodb')

router.route('/')
  .post(async (req, res) => {
    const { email, password } = req.body

    if (password === null || password.length < 5) return res.status(400).send('Password has to be at least 5 characters.')

    var findByEmailResult = await userRepo.find({
      email: email,
    })

    if (findByEmailResult.isSuccess) return res.status(400).send('Email is already taken.')

    var result = await userRepo.create({
      email: email,
      password: password,
      active: false
    })

    if (!result.isSuccess) return res.status(500).send(result)

    res.status(200).send(result)
  })
  .get(auth, async (req, res) => {
    const { user_id } = req.user
    
    var result = await userRepo.find({
      _id: new mongo.ObjectID(user_id)
    })

    if (!result.isSuccess) return res.status(404).send('Cannot find user.')

    result.data.password = null
    res.status(200).send(result)
  })


router.route('/login')
  .post(async (req, res) => {
    const { email, password } = req.body

    var result = await userRepo.find({
      email: email,
      password: password
    })

    if (!result.isSuccess) return res.status(401).send('Invalid email or passowrd.')

    if (!result.data.active) return res.status(401).send('User is not activated.')
    
    const token = jwt.sign(
      { user_id: result.data._id },
      "SOME93855447stodDBshsHD643DhhD7"
    );

    res.status(200).send(token)
  })
  
router.route('/username')
  .patch(auth, async (req, res) => {
    const { user_id } = req.user
    const { username } = req.body

    if (username === null || username === undefined || username === '') return res.status(400).send('Username cannot be empty.')

    var userByUsernameResult = await userRepo.find({
      username: username
    })

    if (userByUsernameResult.isSuccess) return res.status(400).send('This username is already taken.')

    var userByIdResult = await userRepo.find({
      _id: new mongo.ObjectID(user_id)
    })

    var user = userByIdResult.data

    user.username = username;

    console.log(user)

    var updateResult = await userRepo.update(user)

    if (!updateResult.isSuccess) return res.status(400).send('Cannot update username.')

    res.status(200).send()
  })

module.exports = router