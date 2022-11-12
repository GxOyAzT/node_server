const serviceResponse = (status, data = null, error = '') => {
  return {
    status: status,
    data: data,
    error: error
  }
}

module.exports = serviceResponse