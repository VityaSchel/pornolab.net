import PornolabAPI from '@/index.js'
import { request } from '@/utils.js'
import { Forum } from '@/model/forum.js'
import { JSDOM } from 'jsdom'
import { addTo, SelectorHandler } from 'polyfill-pseudoclass-has'

export async function GetForum(this: PornolabAPI, forumId: number, options?: { offset?: number }): Promise<Forum> {
  const response = await request('/forum/viewforum.php?' + new URLSearchParams({
    f: String(forumId),
    ...(options?.offset && { start: String(options.offset) })
  }), { bbData: this.bbData })
    .then(res => res.text())
  console.log(response.length)  

  const dom = new JSDOM(response)
  addTo(dom.window.Element, dom.window.Document, dom.window.DocumentFragment)
  const page = dom.window.document

  const name = page.querySelector('h1.maintitle')

  const [
    subforums
  ] = await Promise.all([
    getSubforums(page)
  ])

  const forum = {
    id: forumId,
    name: name,
    subforums: subforums,
    // announcements: announcements,
    // sticky: sticky,
    // topics: topics,
  }

  return forum
}

export async function getSubforums(document: Document) {
  const table = document.querySelectorAll('table.forumline.forum')
  return table
}