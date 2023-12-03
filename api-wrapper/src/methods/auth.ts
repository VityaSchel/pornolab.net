import { InvalidAuthTokenError, PornolabAPI } from '@/index.js'
import { authTokenRegex } from '@/utils.js'

export function SetAuthToken(this: PornolabAPI, authOptions: { bbData: string }) {
  if(!authTokenRegex.test(authOptions.bbData)) throw new InvalidAuthTokenError(authOptions.bbData)
  this.bbData = authOptions.bbData
}

export async function IsLoggedIn(this: PornolabAPI): Promise<boolean> {
  if(!this.bbData) return false
  const { request } = await this.request('/forum/login.php')
  return request.type === 'opaqueredirect' || request.redirected || request.status === 302
}