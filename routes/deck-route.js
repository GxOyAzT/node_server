const router = require('express').Router();
const deckRepo = require('../services/repos/deck-repo');
const auth = require('../services/auth/auth-middleware');
var mongo = require('mongodb');
const deckService = require('../app/deck');
const {
  sendResponseBasedOnService,
} = require('../services/api/api-reponse-base-on-service');

router
  .route('/')
  .post(auth, async (req, res) => {
    const { user_id } = req.user;
    const { name, fromLang, toLang, public } = req.body;
    
    return sendResponseBasedOnService(
      res,
      await deckService.createDeck({
        name,
        fromLang,
        toLang,
        public,
        user_id,
      })
    );
  })
  .get(auth, async (req, res) => {
    const { user_id } = req.user;
    return sendResponseBasedOnService(
      res,
      await deckService.getFolderByUserID(user_id)
    );
  });

// REMAKE THIS CODE

router.route('/contribution').post(auth, async (req, res) => {
  const { user_id } = req.user;
  const { folder_id, contributor_id, permission_type } = req.body;

  const findResult = await deckRepo.find({
    _id: new mongo.ObjectID(folder_id),
    owner_id: user_id,
  });

  if (!findResult.isSuccess) return res.status(404).send('Cannot find folder.');

  var folder = findResult.data;

  if (folder.owner_id === contributor_id)
    return res
      .status(400)
      .send('You cannot be a contributor of your own folder.');

  if (folder.contributors === undefined) folder.contributors = [];

  if (
    folder.contributors.find(c => (c.contributor_id = contributor_id)) != null
  )
    return res.status(400).send('Already added contributor.');

  folder.contributors.push({
    contributor_id: contributor_id,
    permission_type: permission_type,
  });

  console.log(folder);

  const updateResult = await deckRepo.update(folder);

  if (!updateResult.isSuccess)
    return res.status(400).send('Cannot update folder.');

  res.status(201).send();
});

module.exports = router;
