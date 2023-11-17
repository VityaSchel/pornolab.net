import { PornolabAPI } from '@/index.js'

export function SetAuthToken(this: PornolabAPI, authOptions: { bbData: string }) {
  this.bbData = authOptions.bbData
}