# pornolab.net API JavaScript wrapper

Неофициальный враппер браузерного API для pornolab.net с TypeScript и покрытием тестов Jest. Парсинг HTML с jsdom.

Полная документация по реверс-инженерингу форума доступна на [GitHub](https://github.com/VityaSchel/pornolab.net)

## Установка

```bash
## Используя npm:
npm i gayporn

## Используя yarn:
yarn add gayporn

## Используя pnpm:
pnpm i gayporn
```

## Использование

### Авторизироваться с токеном получить форум id1688
```typescript
import { PornolabAPI } from 'gayporn'

const pornolab = new PornolabAPI()

pornolab.setAuthToken({ bbData: `1-00000000-aAaAaAaAaAaAaAaAaAaA-0000000000-0000000000-0000000000-0000000000-1` })

pornolab.getForum(1688, { offset: 50 })
  .then(({ subforums, announcements, sticky, topics }) => {
    console.log('Форумы:', subforums.map(forum => forum.name).join(', '))
    console.log('Объявления:', announcements.map(topic => topic.title).join(', '))
    console.log('Прилеплено:', sticky.map(topic => topic.title).join(', '))
    console.log('Топики:', topics.map(topic => topic.title).join(', '))
  })
```

### Авторизироваться с логином и паролем и получить топик #1641717
```typescript
import PornolabAPI from 'gayporn'
import input from 'input'

const pornolab = new PornolabAPI()

const login = async (username: string, password: string, captcha?: { solution: string, internals: object }) => {
  try {
    await pornolab.login({ username, password, captcha })
  } catch(e) {
    if (e instanceof PornolabAPI.CaptchaRequiredError) {
      console.error('Введите капчу: ' + e.captcha.url)
      const solution = await input.text('Решение: ')
      await login(username, password, { solution, internals: e.captcha.internals })
    } else if(e instanceof PornolabAPI.CredentialsIncorrectError) {
      console.error('Вы указали неправильные данные для входа')
      throw e
    } else {
      throw e
    }
  }
}

pornolab.getTopic(1641717)
  .then((topic) => {
    console.log('Название:', topic.title)
    console.log('Размер в байтах:', topic.size)
    console.log('Размер торрент файла в байтах:', topic.torrent.size)
    console.log('Зарегистрирован:', topic.createdAt)
    console.log('Скачан:', topic.downloads)
    console.log('Сиды:', topic.downloadStatistics.seeders)
    console.log('Скорость сидов:', topic.downloadStatistics.speed)
    console.log('Личи:', topic.downloadStatistics.leechers)
    console.log('Автор:', topic.author.id, topic.author.name)

    topic.torrent.download()
      .then(torrentFile => {
        console.log('Название торрент-файла:', torrentFile.name)
        // Use torrentFile.content as ArrayBuffer to get raw content
      })
  })
```

## Документация

### PornolabAPI

Инициализировать библиотеку для работы с API. Опционально также можно передать опции для SOCKS прокси, например тор

```ts
type ConstructorOptions = { proxy?: string }
const api = new PornolabAPI(constructor: ConstructorOptions)
```

#### Использование прокси

Эта библиотека поддерживает проксирование запросов через SOCKS5 прокси, которые поддерживает, например, Tor browser. Работает на [https://github.com/Kaciras/fetch-socks](https://github.com/Kaciras/fetch-socks).

Пример:

```ts
const api = new PornolabAPI({
  proxy: {
    host: 'localhost',
    port: 9050,
    type: 5
  }
})
```

### setAuthToken(authToken: { bbData: string }): void

### login

### getForum(forumId: number): Promise<Forum>

Получить информацию о форуме

### getTopic(topicId: number): Promise<Topic>

Получить информацию о топике

### Forum

```ts
export type Forum = {
  id: number
  name: string
  subforums: ForumMin[]
  announcements: TopicMin[]
  sticky: TopicMin[]
  topics: TopicMin[]
}

export type ForumMin = Pick<Forum, 'id' | 'name'> & {
  topics: number
  messages: number
  lastMessage: {
    topicId: number
    date: Date
    author: UserMin
  }
}
```

### Topic

```ts

export type FileTopic = {
  id: number
  type: 'file'
  title: string
  createdAt: Date
  author: UserMin
  size: number
  torrent: {
    size: number
    download: () => Promise<TorrentFile>
  }
  downloads: number
  downloadStatistics: {
    seeders: number
    speed: string
    leechers: number
  }
  htmlContent: string
}

export type InfoTopic = {
  id: number
  type: 'info'
  title: string
  createdAt: Date
  author: UserMin
  htmlContent: string
}

export type Topic = FileTopic | InfoTopic

export type TopicMin = Pick<Topic, 'id' | 'title' | 'author'> & {
  replies: number
  updatedAt: Date
} & (FileTopicMin | InfoTopicMin)

type FileTopicMin = {
  type: 'file'
  downloadStatistics: {
    seeders: number
    leechers: number
  }
  size: number
  downloads: number
}

type InfoTopicMin = {
  type: 'info'
}
```

### User

```ts
export type UserAccount = {
  type: 'user'
  id: number
  name: string
}

export type GuestUser = {
  type: 'guest'
}

export type User = UserAccount | GuestUser

export type UserMin = User
```

### Torrent file

```ts
export type TorrentFile = {
  name: string
  content: ArrayBuffer
}
```

## Лицензия

[MIT](../LICENSE.md)

Если вы используете этот враппер или информацию отсюда в коммерческих целях, буду благодарен за донат 🥰