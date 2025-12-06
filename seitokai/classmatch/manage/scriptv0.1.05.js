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

document.addEventListener('DOMContentLoaded', () => {

  const branchCache = localStorage.getItem('branch');
  if(branchCache) {
    const popup = document.querySelector('.popup-select-game');
    popup.classList.add('success');
  }

  notice();
});

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
    let html = "";
    const idMap = ["from", "to", "type", "content"];
notice.forEach(row => {
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
    setInterval(notice, 10000);

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
