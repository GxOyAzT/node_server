const jwt = require('jsonwebtoken');
const serviceResponse = require('../../models/service-response');
const {
  sendResponseBasedOnService,
} = require('../api/api-reponse-base-on-service');

const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token)
    return sendResponseBasedOnService(
      res,
      await serviceResponse(401, {}, 'A token is required for authentication')
    );
  try {
    const decoded = jwt.verify(token, 'SOME93855447stodDBshsHD643DhhD7');
    req.user = decoded;
  } catch (err) {
    return sendResponseBasedOnService(
      res,
      await serviceResponse(401, {}, `${err}`)
    );
  }
  return next();
};

module.exports = verifyToken;
