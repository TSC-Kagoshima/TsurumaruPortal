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
                } else {
            alert('パスワードが違います');
        }
    } else {
        alert('現在メンテナンス中です。');
    }
}
function logout() {
   localStorage.clear('branch');
   const inputTerm = localStorage.getItem('term');
   window.location.href = "seitokai/classmatch/manage?term=" + inputTerm;
   ///////絶対誤操作でログアウトみたいなのあるから一度ポップアップはさんで確認だす
}
function sendmessage() {
  const commuFrom = localStorage.getItem("branch");
  const commuTo = document.getElementById('commu-to').value;
  const commuType = document.getElementById('commu-type').value;
  const commuContent = document.getElementById('commu-content').value;
  const commu = [commuFrom, commuTo, commuType, commuContent];
  
  fetch(url + "?type=sendcommu", {
    method:"POST",
    body: JSON.stringify(commu),
    headers: { "Content-Type": "application/json" }
  }).then(response => response.json()) // ← テキストとして取得

  document.getElementById('commu-to').value = "";
  document.getElementById('commu-type').value = "";
  document.getElementById('commu-content').value = "";

  document.querySelector('.commu-popup').classList.add('send');
  document.getElementById('commu-popu-content').textContent = "送信が完了しました。　相手：" + commuTo + "<br>種別：" + commuType + "<br>内容：" + commuContent;
  setTimeout(() => {
    document.querySelector('.commu-popup').classList.remove('semd');
  }, 2000);


}

document.addEventListener('DOMContentLoaded', () => {

 const params = new URLSearchParams(window.location.search);
 const value = params.get('term'); 
    if (value !== null) { // term パラメータが存在する場合だけ
        const termInput = document.getElementById('conduct-term');
        if (termInput) {
            termInput.textContent  = value; // input の値にセット
        }
    }
 fetch(url + "?type=notice")
  .then(res => res.json())
  .then(notice => {

    let html = "<table>";

    notice.forEach(row => {
      html += "<tr>";
      row.forEach(cell => {
        html += `<td style="
          background:${cell.background};
          font-weight:${cell.bold ? "bold" : "normal"};
        ">${cell.value}</td>`;
      });
      html += "</tr>";
    });

    html += "</table>";

    document.getElementById('commu-list').innerHTML = html;
  })
  .catch(err => console.error(err));

});

