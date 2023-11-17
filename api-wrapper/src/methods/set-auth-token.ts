import { InvalidAuthTokenError, PornolabAPI } from '@/index.js'
import { authTokenRegex } from '@/utils.js'

export function SetAuthToken(this: PornolabAPI, authOptions: { bbData: string }) {
  if(!authTokenRegex.test(authOptions.bbData)) throw new InvalidAuthTokenError(authOptions.bbData)
  this.bbData = authOptions.bbData
}