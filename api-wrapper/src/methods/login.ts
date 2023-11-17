import PornolabAPI from '@/index.js'
import { AuthExoticError, CaptchaRequiredError, CredentialsIncorrectError, InvalidAuthTokenError } from '@/model/errors.js'
import { authTokenRegex } from '@/utils.js'
import cookie from 'cookie'
import { JSDOM } from 'jsdom'

export type CaptchaInternals = {
  cap_code_suffix: string
  cap_sid: string
}

export async function Login(this: PornolabAPI, { username, password, captcha }: {
  username: string
  password: string
  captcha?: {
    solution: string
    internals: CaptchaInternals
  }
}) {
  if(this.bbData) throw new Error('You are already logged in')

  const { response, request } = await this.request('/forum/login.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      login_username: username,
      login_password: password,
      login: '%C2%F5%EE%E4',
      ...(captcha && {
        cap_sid: captcha.internals.cap_sid,
        [`cap_code_${captcha.internals.cap_code_suffix}`]: captcha.solution
      })
    })
  })

  if(request.status === 302) {
    const cookieJar = cookie.parse(request.headers.get('set-cookie') ?? '')
    request.headers.get('set-cookie')?.match(/bb_data=(.+?);/)
    if (!authTokenRegex.test(cookieJar.bb_data)) throw new InvalidAuthTokenError()
    this.bbData = cookieJar.bb_data
    return this.bbData
  } else {
    const dom = new JSDOM(response)
    const page = dom.window.document

    const error = page.querySelector('h4.warnColor1')?.textContent?.trim()?.replaceAll(/\s/, ' ')?.replaceAll(/\s{2,}/, ' ')

    const handleCaptcha = () => {
      const captchaImage = page.querySelector('img[src~="static.pornolab.net/captcha"]')
      if (!captchaImage) throw new Error('Captcha required for login, but image was not found after parsing login page HTML')
      
      const captchaSid = page.querySelector('input[name=cap_sid]')
      if (!captchaSid) throw new Error('Captcha required for login, but cap_sid was not found after parsing login page HTML')
      
      const captchaCode = page.querySelector('input[name^=cap_code_]')
      if (!captchaCode) throw new Error('Captcha required for login, but cap_code was not found after parsing login page HTML')

      throw new CaptchaRequiredError({
        url: captchaImage.getAttribute('url') ?? '',
        internals: {
          cap_code_suffix: captchaCode.getAttribute('name')?.substring('cap_code_'.length) ?? '',
          cap_sid: captchaSid.getAttribute('value') ?? ''
        }
      })
    }

    switch (error) {
      case 'Вы ввели неверное/неактивное имя пользователя или неверный пароль':
        return handleCaptcha()
      case 'Вы должны правильно ввести код подтверждения':
        throw new CredentialsIncorrectError()
      default:
        throw new AuthExoticError(error ?? '')
    }
  }
}