import { CaptchaInternals } from '@/methods/login.js'

export class UnauthorizedError extends Error {
  constructor(methodName: string) {
    super(`You must be authorized to call ${methodName} method. Please use PornolabAPI.login() or Pornolab.setAuthToken() methods to authorize.`)
  }
}

export class InvalidAuthTokenError extends Error {
  invalidToken

  constructor(invalidToken: string) {
    super('Invalid auth token found in bb_data')
    this.invalidToken = invalidToken
  }
}

export class AuthExoticError extends Error {
  error

  constructor(error: string) {
    super('Unknown error during auth')
    this.error = error
  }
}

export class CaptchaRequiredError extends Error {
  captcha: { url: string, internals: CaptchaInternals }

  constructor(captcha: { url: string, internals: CaptchaInternals }) {
    super('Captcha input required')
    this.captcha = captcha
  }
}

export class CredentialsIncorrectError extends Error {
  constructor() {
    super('Incorrect username or password')
  }
}
