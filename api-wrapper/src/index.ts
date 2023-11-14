import { GetForum } from './methods/forum.js'
import { GetTopic } from './methods/topic.js'

type SessionAuth = {
  bbData: string
}
type AuthOptions = SessionAuth

export default class PornolabAPI {
  bbData: string

  constructor(options: AuthOptions) {
    if ('bbData' in options) {
      this.bbData = options.bbData
    } else {
      throw new Error('No auth options provided in PornolabAPI constructor')
    }
  }
  
  getForum = GetForum
  getTopic = GetTopic
}