const deckRepo = require('../services/repos/deck-repo');
var mongo = require('mongodb');
const serviceResponse = require('../models/service-response');
const { isBooleanObject } = require('util/types');

const getDeckByUserID = async user_id => {
  const result = await deckRepo.find({
    owner_id: user_id,
  });
  if (!result.isSuccess) return serviceResponse(404, {}, 'Cannot find user.');

  return serviceResponse(200, result.data, '');
};

const createDeck = async deck => {
  if (!deck.user_id) {
    return serviceResponse(400, {}, 'User ID name is required.');
  }
  if (!deck.name) {
    return serviceResponse(400, {}, 'Deck name is required.');
  }
  if (!deck.fromLang) {
    return serviceResponse(400, {}, 'Deck language is required.');
  }
  if (!deck.toLang) {
    return serviceResponse(400, {}, 'Deck language is required.');
  }

  if (typeof deck.public !== 'boolean') {
    return serviceResponse(400, {}, 'Deck privacy is required.');
  }

  const response = await deckRepo.create({
    name: deck.name,
    fromLang: deck.fromLang,
    toLang: deck.toLang,
    public: deck.public,
    owner_id: deck.user_id,
    cards: [],
    createDate: new Date(),
    contributors: [],
  });

  return serviceResponse(200, {}, '');
};

module.exports = { getDeckByUserID, createDeck };
