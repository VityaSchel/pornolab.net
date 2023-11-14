import { TorrentFile } from '@/model/torrent-file'
import { UserMin } from '@/model/user'

export type FileTopic = {
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
  type: 'info'
  title: string
  createdAt: Date
  author: UserMin
  htmlContent: string
}

export type Topic = FileTopic | InfoTopic