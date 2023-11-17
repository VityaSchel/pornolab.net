import PornolabAPI from '@/index.js'
import { parseDate, request } from '@/utils.js'
import { Forum, ForumMin } from '@/model/forum.js'
import { JSDOM } from 'jsdom'
import { getTopicMin } from '@/methods/topic.js'
import { UnauthorizedError } from '@/model/errors.js'

export async function GetForum(this: PornolabAPI, forumId: number, options?: { offset?: number }): Promise<Forum> {
  if (!this.bbData) throw new UnauthorizedError('getForum')

  const { response } = await this.request('/forum/viewforum.php?' + new URLSearchParams({
    f: String(forumId),
    ...(options?.offset && { start: String(options.offset) })
  }))

  const dom = new JSDOM(response)
  const page = dom.window.document

  const name = page.querySelector('h1.maintitle')?.textContent?.trim()
  const tables = Array.from(page.querySelectorAll('table.forumline.forum'))
  const subforumsTable = tables.find(table => table.querySelector('tbody > tr > th')?.textContent?.trim() === 'Форум')
  const mainTable = tables.find(table => table.querySelector('tbody > tr > th')?.textContent?.trim() === 'Темы')

  const subforums = subforumsTable ? getSubforums(subforumsTable) : []
  const { announcements: announcementsRows, sticky: stickyRows, topics: topicsRows } = parseMainTable(mainTable!)
  const announcements = getAnnouncements(announcementsRows)
  const sticky = getSticky(stickyRows)
  const topics = getTopics(topicsRows)

  const forum = {
    id: forumId,
    name: name!,
    subforums: subforums,
    announcements: announcements,
    sticky: sticky,
    topics: topics,
  }

  return forum
}

export function getSubforums(subforumsTable: Element): ForumMin[] {
  const rows = Array.from(subforumsTable.querySelectorAll('tr:not(:first-child)'))
  const subforums: ForumMin[] = []
  for(const row of rows) {
    if (row.querySelector('.spaceRow')) continue
    const name = row.querySelector('h4')?.textContent?.trim()
    const id = row.querySelector('h4 > a')?.getAttribute('href')?.match(/^viewforum.php\?f=(\d+)/)?.[1]
    const topics = row.children[2].textContent?.trim()
    const messages = row.children[3].textContent?.trim()
    const lastMessageAuthor = row.children[4].querySelector(':scope > p > a')
    const lastMessage = {
      topicId: row.children[4].querySelector(':scope > h6 > a')?.getAttribute('href')?.match(/viewtopic.php\?t=(\d+)/)?.[1],
      date: row.children[4].querySelector(':scope > p')?.childNodes[0].textContent?.trim()?.replaceAll(/\s{2,}/g, ' ')?.match(/^(.+)\sby$/)?.[1],
      author: {
        id: lastMessageAuthor?.getAttribute('href')?.match(/profile.php\?mode=viewprofile&u=(\d+)/)?.[1],
        name: lastMessageAuthor?.textContent?.trim(),
      }
    }
    
    subforums.push({
      name: name!,
      id: Number(id),
      topics: Number(topics),
      messages: Number(messages),
      lastMessage: {
        topicId: Number(lastMessage.topicId),
        date: parseDate(lastMessage.date!),
        author: lastMessage.author.id === undefined ? {
          type: 'guest'
        } : {
          type: 'user',
          id: Number(lastMessage.author.id),
          name: lastMessage.author.name!,
        }
      }
    } satisfies ForumMin)
  }
  return subforums
}

function getAnnouncements(announcementsRows: Element[]) {
  return announcementsRows.map(getTopicMin)
}

function getSticky(stickyRows: Element[]) {
  return stickyRows.map(getTopicMin)
}

function getTopics(topicsRows: Element[]) {
  return topicsRows.map(getTopicMin)
}

function parseMainTable(table: Element) {
  const rows = Array.from(table.querySelectorAll(':scope > tbody > tr'))
  rows.shift()
  rows.pop()
  const announcements: Element[] = []
  const sticky: Element[] = []
  const topics: Element[] = []

  let currentRows: Element[] = []
  let currentSection: 'announcements' | 'sticky' | 'topics' | null = null
  for (const row of rows) {
    const separator = row.querySelector(':scope > td.topicSep')
    if (separator) {
      if (currentSection === 'announcements') {
        announcements.push(...currentRows)
      } else if (currentSection === 'sticky') {
        sticky.push(...currentRows)
      } else if (currentSection === 'topics') {
        topics.push(...currentRows)
      }
      
      currentRows = []
      if(separator.textContent?.trim() === 'Объявления') {
        currentSection = 'announcements'
      } else if (separator.textContent?.trim() === 'Прилеплены') {
        currentSection = 'sticky'
      } else if (separator.textContent?.trim() === 'Топики') {
        currentSection = 'topics'
      }
    } else {
      if(row.children.length <= 1) continue
      currentRows.push(row)
    }
  }
  topics.push(...currentRows)

  return { announcements, sticky, topics }
}