const userService = require('../../../../application/user')

jest.mock('../../../../services/repos/user-repo', () => {
  return {
    find: jest.fn((filter) => { 
      return {
        isSuccess: true,
        error: '',
        data: {
          username: 'user 1',
          password: 'password1',
          email: 'user1@test.com'
        }
      }
     })
  }
})

test('OK_200', async () => {
  const result = await userService.getUserById('6370d586597d921737015be5')

  expect(result.status).toBe(200)
  expect(result.data.password).toBe(null)
  expect(result.data.email).toBe('user1@test.com')
  expect(result.data.username).toBe('user 1')
})