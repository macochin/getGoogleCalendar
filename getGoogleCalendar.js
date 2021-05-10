// LINE Notifyでトークルームのトークンを取得して以下に設定★
var LINE_NOTIFY_TOKEN = PropertiesService.getScriptProperties().getProperty('LINE_NOTIFY_TOKEN');
var NOTIFY_API = "https://notify-api.line.me/api/notify";

function sendSchedule() { // ---- (*1)
  // 今日の予定を取得 --- (*2)
  var today = new Date();
  var events = CalendarApp.getDefaultCalendar().getEventsForDay(today);
  var bodyItem = [];
  for (var i = 0; i < events.length; i++) {
    var e = events[i];
    var title = e.getTitle();
    
    if (title.indexOf('*') == 0) {
      continue;
    }
    var d = e.getStartTime();
    var dstr = z2(d.getHours()) + ":" + z2(d.getMinutes());
    bodyItem.push(dstr + ">" + title);
  }

  if (bodyItem.length > 0) {
    // LINEに送信 --- (*3)
    _sendMessage(bodyItem.join("\n"));
  }
}

function z2(n) {
  n = "00" + n;
  return n.substr(n.length - 2, 2);
}

// スタンプを送信する
function _sendMessage(msg) {
  // 認証情報のセット
  var headers = {
    "Authorization": "Bearer " + LINE_NOTIFY_TOKEN
  };
  // メッセージをセット
  var payload = {
    "message": "\n" + msg
  };
  // 送信情報をまとめる
  var options = {
    'method' : 'post',
    'contentType' : 'application/x-www-form-urlencoded',
    'headers': headers,
    'payload' : payload
  };
  Logger.log(options);
  // 実際に送信する
  var response = UrlFetchApp.fetch(NOTIFY_API, options);
  Logger.log(response);
}
