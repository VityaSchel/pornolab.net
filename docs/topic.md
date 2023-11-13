# Как автоматически скачивать с pornolab.net и получать другую информацию

Перед прочтением этой статьи ознакомьтесь с тем, как авторизовывать запросы к форуму: [docs/auth.md](./auth.md) и как работает скрейпинг страниц pornolab в целом: [docs/scraping.md](./scraping.md)

## Скачивание торрент файла

Для скачивания торрент-файлов вам нужна ссылка вида `https://pornolab.net/forum/dl.php?t=1624089` где параметр `t` — это ID топика (ссылка выше для топика `https://pornolab.net/forum/viewtopic.php?t=1624089`, обратите внимание, что параметр `t` такой же)

Чтобы ваше приложение оставалось работающим даже если этот формат изменится, вы можете получить URL ссылки "Скачать .torrent", сделав парсинг HTML разметки и получив аттрибут href с помощью 
```js
document.querySelector('.dl-link').getAttribute('href')
```

Информация о размере торрент файла, размере скачиваемого контента, количестве скачиваний, дате регистрации, описании торрента и прочем доступна в этой же разметке, генерируется на сервере.

Чтобы скачать torrent файл, сделайте запрос GET по этой ссылке с заголовком Cookie. В ответ придут заголовки:
- `Content-Type: application/x-bittorrent; name="[pornolab.net].t1624089.torrent"`
- `Content-Disposition: attachment; filename="[pornolab.net].t1624089.torrent"`
- `Content-Length: 12602`
Из них вы можете получить имя файла и его размер в байтах.
Тело ответа — это сам torrent файл, который передается в бинарном формате (сыром). Сохраните его и отдайте пользователю вашего приложения или запишите на диск системы или передайте сразу в зарегистрированный торрент клиент.

У пользователей есть ограничения на скачивание, поэтому рекомендую обрабатывать любые ошибки, которые возвращаются по этой ссылке.

## Получение списка файлов в торренте

Перед скачиванием пользователь может захотеть посмотреть список файлов, входящих в торрент, и их размеры. Эта информация не генерируется на сервере, для получения списка требуется сделать POST запрос к `https://pornolab.net/forum/viewtorrent.php` с Body в формате `application/x-www-form-urlencoded`.

Используйте заголовок Cookie для авторизации, `Content-Type: application/x-www-form-urlencoded; charset=UTF-8`, и тело запроса вида:
```
t=1624089
```
где значение t — это ID топика, для которого вы хотите получить список файлов.

В ответе придет HTML одного из двух видов, перечисленных ниже:

- Если файл всего один:
```html
Sean Cody 1567 Daniel & Brent BB 720p.mov <i>1266929889</i>
```
- Если файлов много и нужно отобразить древовидную структуру:
```html
<div class="tor-root-dir">../crd2</div><ul class="tree-root"><li><span>Crazydoctor57-720x576-end.avi <i>376309158</i></span></li><li><span>Crazydoctor47-720x576-end.avi <i>354049950</i></span></li><li><span>Crazydoctor58-720x576-end.avi <i>351543090</i></span></li><li><span>Crazydoctor59-720x576-end.avi <i>344038476</i></span></li><li><span>Crazydoctor25-720x576-end.avi <i>308798070</i></span></li><li><span>Crazydoctor49-720x576-end.avi <i>305511938</i></span></li><li><span>Crazydoctor53-720x576-end.avi <i>299710518</i></span></li><li><span>Crazydoctor50-720x576-end.avi <i>279122144</i></span></li><li><span>Crazydoctor56-720x576-end.avi <i>279115410</i></span></li><li><span>Crazydoctor48-720x576-end.avi <i>272551508</i></span></li><li><span>Crazydoctor46-720x576-end.avi <i>251476858</i></span></li><li><span>Crazydoctor67-720x576-end.wmv <i>217972477</i></span></li><li><span>Crazydoctor66-720x576-end.wmv <i>213892339</i></span></li><li><span>Crazydoctor43-720x576-end.avi <i>209794370</i></span></li><li><span>Crazydoctor74-720x576-end.wmv <i>192419655</i></span></li><li><span>Crazydoctor69-720x576-end.wmv <i>191827637</i></span></li><li><span>Crazydoctor26-720x576-end.avi <i>160648546</i></span></li><li><span>Crazydoctor44-720x576-end.avi <i>151218358</i></span></li><li><span>Crazydoctor42-720x576-end.avi <i>126949360</i></span></li></ul>
```

При этом размеры файлов указаны в байтах. На сайте они отображаются в человекочитаемом формате, для деления используется 1024, а не 1000, при этом округление работает по математическим правилам, т.е используется Math.round() из JS