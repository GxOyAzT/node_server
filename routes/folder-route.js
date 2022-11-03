const router = require('express').Router()
const folderRepo = require('../services/repos/folder-repo')
const auth = require("../services/auth/auth-middleware")
var mongo = require('mongodb')

router.route('/')
  .post(auth, async (req, res) => {
    const { user_id } = req.user
    const { name, from_lang, to_lang } = req.body

    const response = await folderRepo.create({
      name: name,
      from_lang: from_lang,
      to_lang: to_lang,
      user_id: user_id
    })

    console.log(response)

    res.status(201).send('OK')
  })

module.exports = router