import PornolabAPI from '@/index.js'
import { UnauthorizedError } from '@/model/errors.js'
import { Topic, TopicMin } from '@/model/topic.js'
import { downloadUtility, parseDate, sizeToBytes } from '@/utils.js'
import { JSDOM } from 'jsdom'

export async function GetTopic(this: PornolabAPI, topicId: number): Promise<Topic> {
  if (!this.bbData) throw new UnauthorizedError('getTopic')

  const { response } = await this.request('/forum/viewtopic.php?' + new URLSearchParams({
    t: String(topicId),
  }))

  const dom = new JSDOM(response)
  const page = dom.window.document

  const downloadLink = page.querySelector('.dl-link')?.getAttribute('href')
  const isFileTopic = downloadLink !== null

  const title = page.querySelector('h1.maintitle')?.textContent?.trim()
  const createdAt = parseDate(page.querySelector('#topic_main > tbody:nth-child(2) .post_head a.small')?.textContent?.trim())
  const authorName = page.querySelector('#topic_main > tbody:nth-child(2) .nick-author')?.textContent?.trim()
  const authorId = page.querySelector('#topic_main > tbody:nth-child(2) .poster_btn > .post_btn_2 > a:first-child')?.getAttribute('href')?.match(/profile.php\?mode=viewprofile&u=(\d+)/)?.[1]
  const author = authorId === undefined ? {
    type: 'guest' as const
  } : {
    type: 'user' as const,
    id: Number(authorId),
    name: authorName!
  }
  const htmlContent = page.querySelector('.post-user-message')?.innerHTML.trim()

  let topic
  
  if(isFileTopic) {
    const [,,downloadsCell,sizeCell] = page.querySelectorAll('#tor-reged > table:first-child .row1')
    const size = sizeCell.children[1].textContent?.trim()
    const downloads = downloadsCell.children[1].childNodes[0].textContent?.trim().match(/^(\d+)\sраз$/)?.[1]
    const seed = page.querySelector('.seed')
    const seeders = seed?.querySelector(':scope > b')?.textContent?.trim()
    const downloadSpeed = seed?.childNodes[2]?.textContent?.trim()?.match(/^\[ +(.+?) +\]$/)?.[1]
    const leechers = page.querySelector('.leech > b')?.textContent?.trim()

    const torrentSize = page.querySelector('p .dl-link')?.parentNode?.nextSibling?.nextSibling?.textContent?.trim()

    topic = {
      type: 'file',
      id: topicId,
      title: title!,
      createdAt,
      author,
      htmlContent: htmlContent!,
      size: sizeToBytes(size),
      downloads: Number(downloads),
      torrent: {
        size: sizeToBytes(torrentSize),
        download: () => {
          if (!this.bbData) throw new UnauthorizedError('torrent.download')
          return downloadUtility({ bbData: this.bbData }, topicId)
        }
      },
      downloadStatistics: {
        seeders: seeders === undefined ? 0 : Number(seeders),
        speed: downloadSpeed ?? '0 KB/s',
        leechers: leechers === undefined ? 0 : Number(leechers)
      }
    } satisfies Topic
  } else {
    topic = {
      type: 'info',
      id: topicId,
      title: title!,
      createdAt,
      author,
      htmlContent: htmlContent!
    } satisfies Topic
  }

  return topic
}

export function getTopicMin(topicRow: Element): TopicMin {
  const [,nameCell,torrentCell,statsCell,dateCell] = topicRow.children

  const name = nameCell.querySelector('.torTopic > a')
  const id = name?.getAttribute('href')?.match(/viewtopic.php\?t=(\d+)/)?.[1]
  const title = name?.textContent
  const authorId = nameCell.querySelector('div.topicAuthor > a.topicAuthor')?.getAttribute('href')?.match(/profile.php\?mode=viewprofile&u=(\d+)/)?.[1]
  const authorName = nameCell.querySelector('div.topicAuthor')?.textContent?.trim()
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
      author: authorId === undefined ? {
        type: 'guest'
      } : {
        type: 'user',
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
      author: authorId === undefined ? {
        type: 'guest'
      } : {
        type: 'user',
        id: Number(authorId),
        name: authorName!
      },
      replies: replies,
      type: 'info'
    } satisfies TopicMin

  }

  return topicMin
}