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
            popup.classList.add('success');
            alert('認証が完了しました');
        } else {
            alert('パスワードが違います');
        }
    } else {
        alert('現在メンテナンス中です。');
    }
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
})