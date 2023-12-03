import '../env.js'
import { PornolabAPI } from '../out/index.js'

const bbData = process.env.BB_DATA
if (!bbData) throw new Error('Fill BB_DATA in .env file')

const pornolab = new PornolabAPI()

pornolab.setAuthToken({ bbData })
if (!await pornolab.isLoggedIn()) {
  throw new Error('Invalid BB_DATA')
}

pornolab.getTopic(1641717)
  .then((topic) => {
    console.log('Название:', topic.title)
    console.log('Зарегистрирован:', topic.createdAt)
    if (topic.type === 'file') {
      console.log('Размер в байтах:', topic.size)
      console.log('Размер торрент файла в байтах:', topic.torrent.size)
      console.log('Скачан:', topic.downloads)
      console.log('Сиды:', topic.downloadStatistics.seeders)
      console.log('Скорость сидов:', topic.downloadStatistics.speed)
      console.log('Личи:', topic.downloadStatistics.leechers)
      if (topic.author.type === 'user') {
        console.log('Автор:', topic.author.id, topic.author.name)
      }
  
      topic.torrent.download()
        .then(torrentFile => {
          console.log('Название торрент-файла:', torrentFile.name)
          // Use torrentFile.content as Buffer to get raw content
        })
    }
  })