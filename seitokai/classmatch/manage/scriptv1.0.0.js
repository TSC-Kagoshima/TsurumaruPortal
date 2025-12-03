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
        if(part === "tbc-tech" && password === "1234") {
            const gamebranch = document.getElementById('game-branch').value;
            popup.classList.add('success');
            alert('認証が完了しました');
            localStorage.setItem("branch", gamebranch);
                } else {
            alert('パスワードが違います');
        }
    } else {
        alert('現在メンテナンス中です。');
    }
}

function sendmessage() {
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

