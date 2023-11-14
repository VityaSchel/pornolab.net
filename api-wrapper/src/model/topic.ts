import { TorrentFile } from '@/model/torrent-file'
import { UserMin } from '@/model/user'

export type FileTopic = {
  id: number
  type: 'file'
  title: string
  createdAt: Date
  author: UserMin
  size: number
  torrent: {
    size: number
    download: () => Promise<TorrentFile>
  }
  downloads: number
  downloadStatistics: {
    seeders: number
    speed: string
    leechers: number
  }
  htmlContent: string
}

export type InfoTopic = {
  id: number
  type: 'info'
  title: string
  createdAt: Date
  author: UserMin
  htmlContent: string
}

export type Topic = FileTopic | InfoTopic

export type TopicMin = Pick<Topic, 'id' | 'title' | 'author'> & {
  replies: number
  updatedAt: Date
} & (FileTopicMin | InfoTopicMin)

type FileTopicMin = {
  type: 'file'
  downloadStatistics: {
    seeders: number
    leechers: number
  }
  size: number
  downloads: number
}

type InfoTopicMin = {
  type: 'info'
}