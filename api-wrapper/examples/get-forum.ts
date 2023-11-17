import '../env.js'
import { PornolabAPI } from '../out/index.js'

const bbData = process.env.BB_DATA
if (!bbData) throw new Error('Fill BB_DATA in .env file')

const pornolab = new PornolabAPI()

pornolab.setAuthToken({ bbData })

pornolab.getForum(1688)
  .then(({ subforums, announcements, sticky, topics }) => {
    console.log('Форумы:\n' + subforums.map(forum => ' - ' + forum.name).join('\n'))
    console.log('Объявления:\n' + announcements.map(topic => ' - ' + topic.title).join('\n'))
    console.log('Прилеплено:\n' + sticky.map(topic => ' - ' + topic.title).join('\n'))
    console.log('Топики:\n' + topics.map(topic => ' - ' + topic.title).join('\n'))
  })