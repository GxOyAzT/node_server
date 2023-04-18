const dbProvider = require('../db/mongo-connection');

const create = async deck => {
  const db = await dbProvider();
  const result = await db.collection('deck').insertOne(deck);
  return {
    isSuccess: true,
    error: '',
    data: {},
  };
};

const find = async filter => {
  const db = await dbProvider();
  const result = await db.collection('deck').find(filter).toArray();
  if (result === null)
    return {
      isSuccess: false,
      error: 'Cannot find deck.',
      data: {},
    };

  return {
    isSuccess: true,
    error: '',
    data: result,
  };
};

const update = async deck => {
  const db = await dbProvider();
  const result = await db
    .collection('deck')
    .replaceOne({ _id: deck._id }, deck, { upsert: true });

  if (result === null)
    return {
      isSuccess: false,
      error: 'Cannot update deck.',
      data: null,
    };

  return {
    isSuccess: true,
    error: '',
    data: result,
  };
};

module.exports = { create, find, update };
