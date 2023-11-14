import '../env.js'
import PornolabAPI from '../out/index.js'

const bbData = process.env.BB_DATA
if (!bbData) throw new Error('Fill BB_DATA in .env file')

const pornolab = new PornolabAPI({ bbData })

pornolab.getForum(1688, { offset: 50 })
  .then(({ subforums/*, announcements, sticky, topics*/ }) => {
    console.log('Форумы:', subforums/*.map(forum => forum.name).join(', ')*/)
    // console.log('Объявления:', announcements.map(topic => topic.title).join(', '))
    // console.log('Прилеплено:', sticky.map(topic => topic.title).join(', '))
    // console.log('Топики:', sticky.map(topic => topic.title).join(', '))
  })