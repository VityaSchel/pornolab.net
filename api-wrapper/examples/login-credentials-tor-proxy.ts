import '../env.js'
import { CaptchaRequiredError, CredentialsIncorrectError, CaptchaInternals, PornolabAPI } from '../out/index.js'
import type { Topic } from '../out/model/topic.js'
import type { UserMin } from '../out/model/user.js'
import input from 'input'

const pornolab = new PornolabAPI({
  proxy: {
    host: '127.0.0.1',
    port: 9150,
    type: 5
  }
})

if (!process.env.USERNAME || !process.env.PASSWORD) throw new Error('Fill USERNAME and PASSWORD in .env file')

const login = async (username: string, password: string, captcha?: { solution: string, internals: CaptchaInternals }) => {
  try {
    await pornolab.login({ username, password, captcha })
  } catch (e) {
    if (e instanceof CaptchaRequiredError) {
      console.error('Введите капчу: ' + e.captcha.url)
      const solution = await input.text('Решение: ')
      await login(username, password, { solution, internals: e.captcha.internals })
    } else if (e instanceof CredentialsIncorrectError) {
      console.error('Вы указали неправильные данные для входа')
      throw e
    } else {
      throw e
    }
  }
}

await login(process.env.USERNAME, process.env.PASSWORD)

pornolab.getTopic(3004750)
  .then((topic: Topic) => {
    if(topic.type !== 'file') return
    const topicAuthor: UserMin = topic.author
    console.log('Название:', topic.title)
    console.log('Размер в байтах:', topic.size)
    console.log('Размер торрент файла в байтах:', topic.torrent.size)
    console.log('Зарегистрирован:', topic.createdAt)
    console.log('Скачан:', topic.downloads)
    console.log('Сиды:', topic.downloadStatistics.seeders)
    console.log('Скорость сидов:', topic.downloadStatistics.speed)
    console.log('Личи:', topic.downloadStatistics.leechers)
    console.log('Автор:', topicAuthor.type === 'guest' ? 'Гость' : topicAuthor.id + ' ' + topicAuthor.name)

    topic.torrent.download()
      .then(torrentFile => {
        console.log('Название торрент-файла:', torrentFile.name)
        // Use torrentFile.content as Buffer to get raw content
      })
  })