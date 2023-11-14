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