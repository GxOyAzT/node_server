const folderRepo = require('../services/repos/folder-repo');
var mongo = require('mongodb');
const serviceResponse = require('../models/service-response');

const getFolderByUserID = async user_id => {
  const result = await folderRepo.find({
    owner_id: user_id,
  });
  if (!result.isSuccess) return serviceResponse(404, null, 'Cannot find user.');

  return serviceResponse(200, result.data, '');
};

module.exports = { getFolderByUserID };
