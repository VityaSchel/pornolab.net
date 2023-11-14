import { Topic } from '@/model/topic'

export type Forum = {
  id: number
  name: string
  subforums: ForumMin[]
  announcements: Topic[]
  sticky: Topic[]
  topics: Topic[]
}

export type ForumMin = Pick<Forum, 'id' | 'name'> & {
  topics: number
  messages: number
}