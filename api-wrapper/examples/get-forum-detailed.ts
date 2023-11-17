import '../env.js'
import { PornolabAPI } from '../out/index.js'

const bbData = process.env.BB_DATA
if (!bbData) throw new Error('Fill BB_DATA in .env file')

const pornolab = new PornolabAPI()

pornolab.setAuthToken({ bbData })

pornolab.getForum(1688, { offset: 0 })
  .then(({ subforums, announcements, sticky, topics }) => {
    console.log('Форумы:\n' + subforums.map(subforum => JSON.stringify(subforum, null, 2)))
    console.log('Объявления:\n' + announcements.map(topic => JSON.stringify(topic, null, 2)))
    console.log('Прилеплено:\n' + sticky.map(topic => JSON.stringify(topic, null, 2)))
    console.log('Топики:\n' + topics.map(topic => JSON.stringify(topic, null, 2)))
  })