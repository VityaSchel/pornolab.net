import type { SocksProxies } from 'fetch-socks'
import { request } from './utils.js'

import { SetAuthToken } from './methods/set-auth-token.js'
import { Login } from './methods/login.js'
import { GetForum } from './methods/forum.js'
import { GetTopic } from './methods/topic.js'

type ConstructorOptions = {
  proxy?: SocksProxies
}

export default class PornolabAPI {
  bbData: string | null = null
  proxy: SocksProxies | undefined

  constructor(options: ConstructorOptions) {
    this.proxy = options.proxy
  }
  
  setAuthToken = SetAuthToken
  login = Login
  getForum = GetForum
  getTopic = GetTopic

  request(...args: Parameters<typeof request>) {
    return request.bind(this)(...args)
  }
}

export { downloadUtility } from './utils.js'