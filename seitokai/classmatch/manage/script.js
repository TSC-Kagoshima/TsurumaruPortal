function login() {
    const part = document.getElementById('game-branch');
    const password = document.getElementById('password');
    const set = [part, password]
    ////あとはfetchでgasへ
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