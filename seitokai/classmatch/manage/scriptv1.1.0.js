const url = "https://fetch.tsurumarubroadcast.workers.dev/";

async function login() {
    document.getElementById('send-login-btn').textContent = "送信中";

    const res = await fetch(url + "?type=login", {
      method:"POST",
      body: JSON.stringify({
        term: new URLSearchParams(window.location.search).get('term'),
        branch: document.getElementById('game-branch').value,
        password: document.getElementById('password').value
      }),
    headers: { "Content-Type": "application/json" }
    })

    const json = await res.json();
      console.log(json);
      if(json.result == "success") {
          loginSuccess();
      } else {
        alert('支部、またはパスワードが違います。実施学期を間違えた場合は前のページに戻ってください。');
      }      
  }    
function loginSuccess() {
      localStorage.setItem("branch", document.getElementById('game-branch').value);
      document.querySelector('.popup-select-game').classList.add('success');

      document.getElementById('commu-popup-content').innerHTML = "ログインしました。" 
        + new URLSearchParams(window.location.search).get('term') + "：" + document.getElementById('game-branch').value;
        loadGame();
        document.querySelector('.logout').classList.add('visible');
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
    team2: document.getElementById('team2').value,
    point2: document.getElementById('team2point').value,
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
  document.getElementById('commu-popup-content').innerHTML = `
  送信が完了しました。<br> <big>${result.game}</big>${result.type}　試合結果　${result.team1}　${result.point1}点 VS ${result.team2}　${result.point2}点`;
  setTimeout(() => {
    document.querySelector('.commu-popup').classList.remove('send');
    commubutton = false;
  }, 3000);


}

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const value = params.get('term'); 

  const branchCache = localStorage.getItem('branch');
  const termCache = localStorage.getItem('term')
  if(branchCache) {
    if(termCache == value) {    
      const popup = document.querySelector('.popup-select-game');
      popup.classList.add('success');
      loadGame();
      document.querySelector('.logout').classList.add('.visible')
    }
  }
  
  notice();
});
function loadGame() {
    const params = new URLSearchParams(window.location.search);
    const value = params.get('term'); 
    const gameteam = localStorage.getItem('branch').slice(0, -2);


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
}

let lastUpdate = 0;  
const socket = new WebSocket(url);

socket.onopen = () => {
  console.log("connected!");
};

// Workers から push が来たときだけ UI 更新
socket.onmessage = (event) => {
  const result = JSON.parse(event.data);
  if (result.updated) {
    notice(result.data);  // ここで描画更新関数を呼ぶ
  }
};

socket.onerror = (e) => console.error("WS error", e);

socket.onopen = () => {
  console.log("connected!");
};

// Workers から push が来たときだけ UI 更新
socket.onmessage = (event) => {
  const result = JSON.parse(event.data);
  if (result.updated) {
    notice(result.data);  // ここで描画更新関数を呼ぶ
  }
};

socket.onerror = (e) => console.error("WS error", e);

function notice(notice) {
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
    document.getElementById('commu-list').innerHTML = html;
  })
  .catch(err => console.error(err));
};

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
