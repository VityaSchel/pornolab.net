# Как скрейпить страницы на pornolab.net

Перед прочтением этой статьи ознакомьтесь с тем, как авторизовывать запросы к форуму: [docs/auth.md](./auth.md)

Для запросао главной страницы форума сделайте GET запрос к `https://pornolab.net/forum/index.php` с заголовком Cookie.
Для запроса других страниц, например конкретной категории, используйте аналогичный GET запрос к `https://pornolab.net/forum/viewforum.php?f=1688` или подкатегории `https://pornolab.net/forum/viewforum.php?f=1777`
Для запроса темы (топика) аналогично сделайте GET запрос, например к `https://pornolab.net/forum/viewtopic.php?t=1641717`

Весь необходимый контент генерируется на серверной стороне, поэтому для получения данных сделайте обычный парсинг HTML разметки без выполнения кода JavaScript на странице.

Действия, такие как "Сказать спасибо" или выполняются с помощью форм и POST запросов, прямо как в 2012 годах, ну или как на любом сайте, на который заходят преимущественно через Tor. Чтобы выполнить такое действие, сгенерируйте тело запроса x-www-form-urlencoded и отправьте POST на https://pornolab.net/forum/ajax.php с `Content-Type: application/x-www-form-urlencoded; charset=UTF-8`. 

## Примеры действий:

1. Кнопка "Сказать спасибо":

Body:
```
action=thx&mode=add&topic_id=1641717&t_hash=[token]&form_token=[form_token]
```

token и form_token берутся из инлайн-скрипта javascript на странице, в котором они уже переданы с сервера, ищите по `.thx-container > script`, внутри него будет такой контент:

```js
  function thx_wrap_users () {
    $('.thx-list b').each(function () {
      var uid = $(this).find('u').text();
      if (uid > 0) {
        $(this).wrap('<a href="./profile.php?mode=viewprofile&amp;u=' + uid + '"></a>');
      }
      if (uid == ЗДЕСЬ_ВАШ_USERID) {
        $('#thx-btn').attr({'disabled': true, title: 'Вы уже сказали "Спасибо"'});
      }
    });
  }

  ajax.thx = function (mode) {
    ajax.exec({
      action: 'thx',
      mode: mode,
      topic_id: '1624089',
      t_hash: 'ЗДЕСЬ_ВАШ_ТОКЕН',
    });
  };
  ajax.callback.thx = function (data) {
    if (data.mode == 'add') {
      $('#thx-btn').hide().after('<h2 style="color: green;">Спасибо за благодарность!</h2>');
    }
    if ($('div.thx-list').length) {
      $('.thx-list').html(data.html);
      $('.thx-list b').after(' ');
      thx_wrap_users();
    }
  };

  $(function(){
    if ($('div.thx-list').length) {
      $('div.thx-list b').after(' ');
    }
    $('#thx-btn').one('click', function () {
      $(this).prop({ disabled: true });
      var stdShowErrorMsg = ajax.showErrorMsg;
      ajax.showErrorMsg = function (msg) {
        $('.thx-form').html(msg).addClass('thx-err-msg');
        ajax.showErrorMsg = stdShowErrorMsg;
      };
      ajax.thx('add');
    });
    thx_wrap_users();
    // fix vsexshop ads
    var $thx_context = $('.thx-container');
    if ($('.sp-wrap > .sp-head', $thx_context).length == 0)	{
      initSpoilers($thx_context);
    }
  });
```

Ответ приходит в формате json:
```json
{"mode":"add","html":"<b><u>12345678<\/u>Username <i>(13-\u041d\u043e\u044f-23)<\/i><\/b><\/i><\/b>","action":"thx"}
```
В html будет список аналогичных тегов `<b><u></u></b>` для каждого кто поблагодарил

1. Похожие раздачи:

Body:
```
action=get_related_topics&topic_id=1120961&form_token=[form_token]
```

Ответ приходит в формате json:
```json
{"html":"<ul class='related-topics-list'><li>[здесь ссылки на раздачи]<\/li><\/ul>","action":"get_related_topics"}
```

О том, где взять "Спиок файлов" и про ссылку на "Скачать .torrent файл" читайте в [docs/topic.md](./topic.md)