const userService = require('../../../../application/user')

jest.mock('../../../../services/repos/user-repo', () => {
  return {
    find: jest.fn((filter) => { 
      return { isSuccess: true } 
     }),
    create: jest.fn()
  }
})
  
test('400_email_exists', async () => {
  const result = await userService.register({ email: 'test@test.com', password: 'password1' })

  expect(result.status).toBe(400)
  expect(result.error).toBe('Email is already taken.')
})