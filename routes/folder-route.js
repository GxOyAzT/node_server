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
      owner_id: user_id
    })

    console.log(response)

    res.status(201).send()
  })

router.route('/contribution')
  .post(auth, async (req, res) => {
    const { user_id } = req.user
    const { folder_id, contributor_id, permission_type } = req.body

    const findResult = await folderRepo.find({
      _id: new mongo.ObjectID(folder_id),
      owner_id: user_id
    })

    if (!findResult.isSuccess) return res.status(404).send('Cannot find folder.')

    var folder = findResult.data

    if (folder.owner_id === contributor_id) return res.status(400).send('You cannot be a contributor of your own folder.')
    
    if (folder.contributors === undefined) folder.contributors = []


    if (folder.contributors.find(c => c.contributor_id = contributor_id) != null) return res.status(400).send('Already added contributor.')

    folder.contributors.push({
      contributor_id: contributor_id,
      permission_type: permission_type
    })

    console.log(folder)

    const updateResult = await folderRepo.update(folder)

    if (!updateResult.isSuccess) return res.status(400).send('Cannot update folder.')

    res.status(201).send()
  })

module.exports = router