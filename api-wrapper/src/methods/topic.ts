import PornolabAPI from '@/index.js'
import { TopicMin } from '@/model/topic.js'
import { sizeToBytes } from '@/utils.js'

export async function GetTopic(this: PornolabAPI, topicId: number): Promise<Topic> {
  this.bbData
}

export function getTopicMin(topicRow: Element): TopicMin {
  const [,nameCell,torrentCell,statsCell,dateCell] = topicRow.children

  const name = nameCell.querySelector('.torTopic > a')
  const id = name?.getAttribute('href')?.match(/^viewtopic.php\?t=(\d+)/)?.[1]
  const title = name?.textContent
  const authorId = name?.querySelector('a.topicAuthor')?.getAttribute('href')?.match(/profile.php\?mode=viewprofile&u=(\d+)/)?.[1]
  const authorName = name?.querySelector('a.topicAuthor')?.textContent?.trim()
  const replies = Number(statsCell.querySelector(':scope > p:first-child > span')!.textContent!.trim())
  const updatedAt = new Date(dateCell.querySelector(':scope > p:first-child')!.textContent!.trim())

  let topicMin: TopicMin

  const isFileTopic = torrentCell.children.length > 0
  if(isFileTopic) {
    const downloads = Number(statsCell.querySelector(':scope > p:nth-child(2) > b')?.textContent?.trim())
    const size = sizeToBytes(torrentCell.querySelector('a.dl-stub')?.textContent?.trim())
    const seeders = torrentCell.querySelector('span.seedmed')?.textContent?.trim()
    const leechers = torrentCell.querySelector('span.leechmed')?.textContent?.trim()

    topicMin = {
      id: Number(id),
      title: title!,
      updatedAt: updatedAt!,
      author: {
        id: Number(authorId),
        name: authorName!
      },
      replies: replies,
      type: 'file',
      downloads,
      size: size,
      downloadStatistics: {
        seeders: Number(seeders),
        leechers: Number(leechers)
      }
    } satisfies TopicMin
  } else {
    topicMin = {
      id: Number(id),
      title: title!,
      updatedAt: updatedAt!,
      author: {
        id: Number(authorId),
        name: authorName!
      },
      replies: replies,
      type: 'info'
    } satisfies TopicMin

  }

  return topicMin
}