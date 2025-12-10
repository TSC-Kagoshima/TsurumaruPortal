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