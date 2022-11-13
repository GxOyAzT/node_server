const userService = require('../../../../application/user')

jest.mock('../../../../services/repos/user-repo', () => {
  return {
    find: jest.fn((filter) => { 
      return {
        isSuccess: false,
        error: 'Cannot find user',
        data: null
      }
     })
  }
})

test('OK_200', async () => {
  const result = await userService.getUserById('6370d586597d921737015be5')

  expect(result.status).toBe(404)
  expect(result.data).toBe(null)
})