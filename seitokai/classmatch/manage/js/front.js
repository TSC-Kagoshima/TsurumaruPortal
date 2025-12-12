function loginSuccess() {
    const params = new URLSearchParams(window.location.search);
      localStorage.setItem("branch", document.getElementById('game-branch').value);
      document.querySelector('.popup-select-game').classList.add('success');
      localStorage.setItem("term",params.get('term'));
      document.getElementById('commu-popup-content').innerHTML = "ログインしました。" 
        + new URLSearchParams(window.location.search).get('term') + "：" + document.getElementById('game-branch').value;
        loadGame();
        document.querySelector('.logout').classList.add('visible');
}
function logout() {
   document.querySelector('.logout-popup').classList.add(".visible");
}
function logoutB(){
  localStorage.removeItem("branch");
  window.location.href = "";
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

});