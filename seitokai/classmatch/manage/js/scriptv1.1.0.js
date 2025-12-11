const url = "https://classmatch.tsurumarubroadcast.workers.dev/";

async function login() {
    document.getElementById('send-login-btn').textContent = "送信中";

    const res = await fetch(url + "?type=login", {
      method:"POST",
      body: JSON.stringify({
        action: "login",
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


let sendbutton = false;
function sendGameResult() {
  if(sendbutton == true) { 
    return;
  }
  commubutton = true;
  const result = {
    action: "registerresult",
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

function loadGame() {
    const params = new URLSearchParams(window.location.search);
    const value = params.get('term'); 
    const gameteam = localStorage.getItem('branch').slice(0, -2);


if (gameteam) {
    fetch(url + "?type=selectteam", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "selectteam", // ← GAS 側で判定する用
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

async function notice() {
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      body: {action: "notice"
      }
    });

    // JSONに変換
    const notice = await response.json();
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
setInterval(notice, 15000);

////////notice既読機能
document.getElementById('commu-list').addEventListener('click', (e) => {
    const div = e.target.closest('.commulist');
    if (!div) return; // .commulist じゃなければ無視

    div.classList.add('read');

    const idToSend = { 
      action: "readcommu",
      readid: div.dataset.id 
    };
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

let commubutton = false;//状態フラグ
function sendmessage() {
  if(commubutton == true) {
    return;
  }

  commubutton = true;

  const commu = {
  action: "sendcommu",
  afrom: localStorage.getItem("branch"),
  to: document.getElementById('commu-to').value,
  type: document.getElementById('commu-type').value,
  content: document.getElementById('commu-content').value
 };
  
  const fe = fetch(url + "?type=sendcommu", {
    method:"POST",
    body: JSON.stringify(commu),
    headers: { "Content-Type": "application/json" }
  }).then(response => response.json()) // ← テキストとして取得
  console.log(commu);
  console.log(fe);
  document.getElementById('commu-to').value = "";
  document.getElementById('commu-type').value = "";
  document.getElementById('commu-content').value = "";

  document.querySelector('.commu-popup').classList.add('send');
  document.getElementById('commu-popup-content').innerHTML = "送信が完了しました。　相手：" + commu.to + "<br>種別：" + commu.type + "<br>内容：" + commu.content;
  setTimeout(() => {
    document.querySelector('.commu-popup').classList.remove('send');
    commubutton = false;
    notice();
  }, 3000);


}

