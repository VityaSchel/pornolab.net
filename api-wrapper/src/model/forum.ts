import { TopicMin } from '@/model/topic'
import { UserMin } from '@/model/user.js'

export type Forum = {
  id: number
  name: string
  subforums: ForumMin[]
  announcements: TopicMin[]
  sticky: TopicMin[]
  topics: TopicMin[]
}

export type ForumMin = Pick<Forum, 'id' | 'name'> & {
  topics: number
  messages: number
  lastMessage: {
    topicId: number
    date: Date
    author: UserMin
  }
}