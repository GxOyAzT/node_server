const sendResponseBasedOnService = (apiRes, serviceRes) => {
  if (serviceRes.status >= 200 && serviceRes.status < 300) {
    return apiRes.status(serviceRes.status).send(serviceRes.data)
  }
  
  return apiRes.status(serviceRes.status).send(serviceRes.error)
}

module.exports = { sendResponseBasedOnService }