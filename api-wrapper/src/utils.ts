export async function request(path: string, auth: { bbData: string }, options?: { method?: string, body?: any, headers: Record<string, string> }) {
  return await fetch(`https://pornolab.net${path}`, {
    method: options?.method ?? 'GET',
    ...(options?.body && { body: options.body }),
    headers: {
      Cookie: `bb_data=${auth.bbData}; testCookie=1; cookie_notice=1`,
      ...options?.headers
    }
  })
}