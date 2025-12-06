const url = "https://fetch.tsurumarubroadcast.workers.dev/";

function login() {
    const part = document.getElementById('game-branch').value;
    const password = document.getElementById('password').value;
    const set = [part, password];
    ////あとはfetchでgasへ
    const params = new URLSearchParams(window.location.search);
    const value = params.get('term'); 
    const popup = document.querySelector('.popup-select-game');
    if(value == "テスト用") {
        if(part === "放送部技術局" && password === "1234") {
            const gamebranch = document.getElementById('game-branch').value;
            popup.classList.add('success');
            alert('認証が完了しました');
            localStorage.setItem("branch", gamebranch);
            localStorage.setItem('term', value);
            document.querySelector('.logout').classList.add('visible')
                } else {
            alert('パスワードが違います');
        }
    } else {
        alert('現在メンテナンス中です。');
    }
}
function logout() {
   localStorage.clear('branch');
   window.location.href = "";
}

let commubutton = false;//状態フラグ
function sendmessage() {
  if(commubutton == true) {
    return;
  }

  commubutton = true;

  const commu = {
  afrom: localStorage.getItem("branch"),
  to: document.getElementById('commu-to').value,
  type: document.getElementById('commu-type').value,
  content: document.getElementById('commu-content').value
 };
  fetch(url + "?type=sendcommu", {
    method:"POST",
    body: JSON.stringify(commu),
    headers: { "Content-Type": "application/json" }
  }).then(response => response.json()) // ← テキストとして取得

  document.getElementById('commu-to').value = "";
  document.getElementById('commu-type').value = "";
  document.getElementById('commu-content').value = "";

  document.querySelector('.commu-popup').classList.add('send');
  document.getElementById('commu-popup-content').innerHTML = "送信が完了しました。　相手：" + commu.to + "<br>種別：" + commu.type + "<br>内容：" + commu.content;
  setTimeout(() => {
    document.querySelector('.commu-popup').classList.remove('send');
    commubutton = false;
  }, 3000);


}

let sendbutton = false;
function sendGameResult() {
  if(sendbutton == true) { 
    return;
  }
  commubutton = true;
  const result = {
    game: localStorage.getItem("branch").slice(0,-2),
    type: document.getElementById('game-type').value,
    team1: document.getElementById('team1').value,
    point1: document.getElementById('team1point').value,
    team1: document.getElementById('team2').value,
    point1: document.getElementById('team2point').value,
    term: localStorage.getItem("term")
  };

  fetch(url + "?type=sendresult", {
    method: "POST",
    body: JSON.stringify(result),
    headers: { "Content-Type": "application/json" }
  }).then(response => response.json())
  
  document.getElementById('game-type').value = "";
  document.getElementById('team1').value = "";
  document.getElementById('team1point').value = "";
  document.getElementById('team2').value = "";
  document.getElementById('team2point').value = "";

  document.querySelector('.commu-popup').classList.add('send');
  document.getElementById('commu-popup-content').innerHTML = "送信が完了しました。" + result.game + result.type + "試合結果：" + result.team1 + "：" + result.point1 "VS" + result.team2 + "：" +result.point2;
  setTimeout(() => {
    document.querySelector('.commu-popup').classList.remove('send');
    commubutton = false;
  }, 3000);


}

document.addEventListener('DOMContentLoaded', () => {

  const branchCache = localStorage.getItem('branch');
  if(branchCache) {
    const popup = document.querySelector('.popup-select-game');
    popup.classList.add('success');
  }

  notice();
  const params = new URLSearchParams(window.location.search);
  const gameteam = localStorage.getItem('branch').slice(0, -2);
  const value = params.get('term'); 

if (gameteam) {
  fetch(url + "?type=selectteam", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      term: value,
      game: gameteam
    })
  })
  .then(response => response.json())
  .then(res => {
    const allTeams = res.flatMap(l => [l.team1, l.team2, l.team3, l.team4]);
    const selects = document.querySelectorAll('.game-team');
        console.log("allTeams:", allTeams);
    selects.forEach(select => {
      select.innerHTML = ""; // 初期化
      allTeams.forEach(team => {
        const option = document.createElement("option");
        option.value = team;
        option.textContent = team;
        select.appendChild(option);
      });
      console.log(select);
    });
  })
  .catch(err => console.error(err));
}

});


let lastUpdate = 0;  
async function fetchNotice() {
  try {
    // Workers 側でキャッシュ更新があるか確認
    const res = await fetch(`${url}?type=getNotice&longpoll=true&lastUpdate=${lastUpdate}`);
    const result = await res.json();

    // 更新があった場合だけ notice() を呼ぶ
    if (result.updated) {
      lastUpdate = result.timestamp; // タイムスタンプ更新
      notice();                      // 既存の描画処理を呼び出す
    }
  } catch (err) {
    console.error(err);
  } finally {
    // Long Polling ループ
    fetchNotice();
  }
}

// ページロード時に開始
fetchNotice();
function notice() {

 const params = new URLSearchParams(window.location.search);
 const value = params.get('term'); 
    if (value !== null) { // term パラメータが存在する場合だけ
        const termInput = document.getElementById('conduct-term');
        if (termInput) {
            termInput.textContent  = value; // input の値にセット
        }
    }
 fetch(url + "?type=getNotice")
  .then(res => res.json())
  .then(notice => {
    console.log(notice);
    const rows = notice.data || notice;
    let html = "";
    const idMap = ["from", "to", "type", "content"];
    rows.forEach(row => {
      const eValue = row[4].value;
      const fValue = row[5].value; 
      html += `<div class='commulist filter radius ${eValue}' data-id="${fValue}">`;
      row.forEach((cell, cellIndex)=> {
        const idValue = idMap[cellIndex] || `col${cellIndex}`;
        html += `<p class="commulist-${idValue}"  style="
          font-weight:${cell.bold ? "bold" : "normal"};">${cell.value}</p>`
    });
    html += "</div>";
 });
    document.getElementById('commu-list').innerHTML = html;
  })
  .catch(err => console.error(err));
}

////////notice既読機能

document.getElementById('commu-list').addEventListener('click', (e) => {
    const div = e.target.closest('.commulist');
    if (!div) return; // .commulist じゃなければ無視

    div.classList.add('read');

    const idToSend = { readid: div.dataset.id };
    console.log(idToSend);
    fetch(url + "?type=readcommu", {
        method: "POST",
        body: JSON.stringify(idToSend),
        headers: { "Content-Type": "application/json" }
    })
    .then(res => res.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));
});
