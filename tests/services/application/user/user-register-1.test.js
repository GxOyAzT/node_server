const userService = require('../../../../services/application/user')

jest.mock('../../../../services/repos/user-repo', () => {
  return {
    find: jest.fn((filter) => { 
      return { isSuccess: false } 
     }),
    create: jest.fn((user) => {
      return { isSuccess: true }
    })
  }
})

test('OK_200', async () => {
  const result = await userService.register({ email: 'test@test.com', password: 'password1' })

  expect(result.status).toBe(200)
})

test('400_undefined_password', async () => {
  const result = await userService.register({ email: 'test@test.com' })

  expect(result.status).toBe(400)
  expect(result.error).toBe('Password has to be at least 5 characters.')
})

test('400_too_short_password', async () => {
  const result = await userService.register({ email: 'user_test_1', password: 'pass' })

  expect(result.status).toBe(400)
  expect(result.error).toBe('Password has to be at least 5 characters.')
})

test('400_email_cannot_be_null', async () => {
  const result = await userService.register({ email: '', password: 'password1' })

  expect(result.status).toBe(400)
  expect(result.error).toBe('Email cannot be empty.')
})

test('400_email_cannot_be_empty', async () => {
  const result = await userService.register({ email: '', password: 'password1' })

  expect(result.status).toBe(400)
  expect(result.error).toBe('Email cannot be empty.')
})