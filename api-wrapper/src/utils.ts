import { TorrentFile } from '@/model/torrent-file.js'
import * as windows1251 from 'windows-1251'

export async function request(path: string, auth: { bbData: string }, options?: { method?: string, body?: any, headers: Record<string, string> }) {
  const response = await fetch(`https://pornolab.net${path}`, {
    method: options?.method ?? 'GET',
    ...(options?.body && { body: options.body }),
    headers: {
      Cookie: `bb_data=${auth.bbData}; testCookie=1; cookie_notice=1`,
      ...options?.headers
    }
  })
    .then(res => res.arrayBuffer())
  const content = Buffer.from(response)
  const text = windows1251.decode(content)
  return text
}

export function sizeToBytes(size?: string) {
  if(!size) return 0
  const [value, unit] = size.split(' ')
  const units = {
    'B': 1,
    'KB': 1024,
    'MB': 1024 * 1024,
    'GB': 1024 * 1024 * 1024,
    'TB': 1024 * 1024 * 1024 * 1024,
  }
  return Number(value) * units[unit]
}

export function parseDate(dateString?: string) {
  if (!dateString) return new Date('Invalid Date')
  const match = dateString.match(/(\d{2})-([а-яА-Я]{3})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/)
  if(!match) return new Date('Invalid Date')
  const [, day, shortMonth, shortYear, hours, minutes, seconds] = match
  const month = [
    'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
    'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'
  ].indexOf(shortMonth)
  return new Date(Number('20' + shortYear), month, Number(day), Number(hours), Number(minutes), Number(seconds))
}

export async function downloadUtility(topicId: number): Promise<TorrentFile> {
    
}