const sendResponseBasedOnService = (apiRes, serviceRes) => {
  return apiRes.status(serviceRes.status).send(serviceRes);
};

module.exports = { sendResponseBasedOnService };
