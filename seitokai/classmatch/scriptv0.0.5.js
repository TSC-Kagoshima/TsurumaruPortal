function viewCreate() {////////新規作成セクションに作成項目を表示
    const view= document.getElementById('view-create');
    const button = document.getElementById('create-initial-button');
    const header = document.querySelector('.create-header');

    button.classList.toggle('invisible');
    header.classList.toggle('upward');

  if (!view.classList.contains('show')) {
    view.style.display = 'block';
    requestAnimationFrame(() => {
      view.classList.add('show');
    });
  } else {
    view.classList.remove('show');
    setTimeout(() => {
      view.style.display = 'none';
    }, 600);
  }
}
    const teamSelect = `
        <option value="" disabled selected>参加チームを選択</option>

        <!-- 11～18 -->
        <option value="11R">11R</option>
        <option value="11R-A">11R-A</option>
        <option value="11R-B">11R-B</option>
        <option value="12R">12R</option>
        <option value="12R-A">12R-A</option>
        <option value="12R-B">12R-B</option>
        <option value="13R">13R</option>
        <option value="13R-A">13R-A</option>
        <option value="13R-B">13R-B</option>
        <option value="14R">14R</option>
        <option value="14R-A">14R-A</option>
        <option value="14R-B">14R-B</option>
        <option value="15R">15R</option>
        <option value="15R-A">15R-A</option>
        <option value="15R-B">15R-B</option>
        <option value="16R">16R</option>
        <option value="16R-A">16R-A</option>
        <option value="16R-B">16R-B</option>
        <option value="17R">17R</option>
        <option value="17R-A">17R-A</option>
        <option value="17R-B">17R-B</option>
        <option value="18R">18R</option>
        <option value="18R-A">18R-A</option>
        <option value="18R-B">18R-B</option>

        <!-- 21～28 -->
        <option value="21R">21R</option>
        <option value="21R-A">21R-A</option>
        <option value="21R-B">21R-B</option>
        <option value="22R">22R</option>
        <option value="22R-A">22R-A</option>
        <option value="22R-B">22R-B</option>
        <option value="23R">23R</option>
        <option value="23R-A">23R-A</option>
        <option value="23R-B">23R-B</option>
        <option value="24R">24R</option>
        <option value="24R-A">24R-A</option>
        <option value="24R-B">24R-B</option>
        <option value="25R">25R</option>
        <option value="25R-A">25R-A</option>
        <option value="25R-B">25R-B</option>
        <option value="26R">26R</option>
        <option value="26R-A">26R-A</option>
        <option value="26R-B">26R-B</option>
        <option value="27R">27R</option>
        <option value="27R-A">27R-A</option>
        <option value="27R-B">27R-B</option>
        <option value="28R">28R</option>
        <option value="28R-A">28R-A</option>
        <option value="28R-B">28R-B</option>

        <!-- 31～38 -->
        <option value="31R">31R</option>
        <option value="31R-A">31R-A</option>
        <option value="31R-B">31R-B</option>
        <option value="32R">32R</option>
        <option value="32R-A">32R-A</option>
        <option value="32R-B">32R-B</option>
        <option value="33R">33R</option>
        <option value="33R-A">33R-A</option>
        <option value="33R-B">33R-B</option>
        <option value="34R">34R</option>
        <option value="34R-A">34R-A</option>
        <option value="34R-B">34R-B</option>
        <option value="35R">35R</option>
        <option value="35R-A">35R-A</option>
        <option value="35R-B">35R-B</option>
        <option value="36R">36R</option>
        <option value="36R-A">36R-A</option>
        <option value="36R-B">36R-B</option>
        <option value="37R">37R</option>
        <option value="37R-A">37R-A</option>
        <option value="37R-B">37R-B</option>
        <option value="38R">38R</option>
        <option value="38R-A">38R-A</option>
        <option value="38R-B">38R-B</option>

        `;

document.querySelectorAll('.create-league').forEach(button => {
    let leagueCount = 0; // ボタンごとにカウント


  button.addEventListener('click', () => {
    leagueCount++;
    const leagueName = String.fromCharCode(64 + leagueCount); // A,B,C...

    const league = document.createElement('div');
    league.classList.add('league-field');
    league.innerHTML = `
        <div class="league-name">${leagueName}リーグ</div>
        <select class="league-team filter">
            ${teamSelect}
        </select>
        <button class="delete-team filter">ー</button>
        <select class="league-team filter">
            ${teamSelect}
        </select>
        <button class="delete-team filter">ー</button>
        <select class="league-team filter">
            ${teamSelect}
        </select>
        <button class="delete-team filter">ー</button>
        <button class="create-team filter">＋追加</button>
    `;

      button.insertAdjacentElement('beforebegin', league);
  });
});
document.addEventListener('click', e => {//////////リーグとチームの追加
  if (e.target.classList.contains('create-team')) {
    // ボタン自身に figure プロパティを作る
    if (!e.target.figure) e.target.figure = 3; // 初回は3
    e.target.figure++; // クリックごとに増やす

  // ラッパー div を作ると管理しやすい
  const wrapper = document.createElement('div');
  wrapper.classList.add('team-wrapper');

  // select 作成
  const team = document.createElement('select');
  team.classList.add('league-team','filter');
  team.id = `team-${e.target.figure}`;
  team.innerHTML = `${teamSelect}`;

  // 削除ボタン作成
  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('delete-team','filter');
  deleteBtn.textContent = 'ー';

  // wrapper に append
  wrapper.appendChild(team);
  wrapper.appendChild(deleteBtn);
    // ボタンの前に挿入
  e.target.insertAdjacentElement('beforebegin', wrapper);
  }

  if (e.target.classList.contains('delete-team')) {
    const selectToDelete = e.target.previousElementSibling;
    if (selectToDelete && selectToDelete.tagName === 'SELECT') {
      selectToDelete.remove();
    }
     e.target.remove(); 
  }
});
const url = "https://fetch.tsurumarubroadcast.workers.dev/";

function  newConduction() {//////////////////システム新規作成
  document.querySelector('.create-conduction-popup').classList.add('send');

  const year = document.getElementById('conduct-year').value;
  const term = document.getElementById('conduct-school-term').value;
   const data = {
    year: year,
    term: term,
    games: [] // 競技ごとの配列
  };
    // 各競技ごとの p.game-type をループ
  document.querySelectorAll('#view-create .game-type').forEach(p => {
    const gameName = p.textContent;
    const leagues = [];

    // 競技ごとの直後のリーグを取得
    let next = p.nextElementSibling;
    while (next && next.classList.contains('league-field')) {
      const leagueElem = next.querySelector('.league-name');
      const leagueName = leagueElem ? leagueElem.textContent : '';
      const teams = [];
      next.querySelectorAll('.league-team').forEach(sel => {
        teams.push(sel.value); // 選択されているチーム
      });
      leagues.push({
        leagueName,
        teams
      });
      next = next.nextElementSibling;
    }

    data.games.push({
      gameName,
      leagues
    });
  });

  console.log(data); // GAS に送る前に確認
    // ここで fetch などで GAS 関数に POST
  fetch(url + "?type=newConduction", {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  }).then(response => response.text()) // ← テキストとして取得
    .then(response => {
     console.log(response);
    if(response == "success") {
      document.getElementById('create-conduction-popup-content').textcontent = "作成が完了しました。リダイレクトします...";
      window.location.href = "/seitokai/classmatch/index.html";
    } else {
      document.getElementById('create-conduction-popup-content').textcontent = "送信中にエラーが発生しました。エラー文：" + response;
    }

  })
 }

 fetch(url + "?type=getTerms")/////////////////実施年・学期を取得(めっちゃ時間かかったから壊れたらなく)
  .then(res => res.json())
  .then(getTerms => {  // ここは GAS からの配列
    const selects = document.querySelectorAll(".termSelect"); // NodeList

    selects.forEach(select => {  // 各 <select> 要素に対して
      getTerms.forEach(name => {  // 配列をループ
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        select.appendChild(option);
      });
    });
  })
  .catch(err => console.error(err));

function setupButton(btnId, selectId,html) {//////////////////////システムを開く
  const btn = document.getElementById(btnId);
  const select = document.getElementById(selectId);

  btn.addEventListener('click', () => {
    const url = html + "?term=" + select.value; // 選択されている option の値
    if (url) {
      window.open(url, '_blank'); // 新しいタブで開く
    } else {
      alert("サイトを選択してください");
    }
  });
}

// ここでボタンIDとselectIDを渡す
setupButton('select-term-submit-btn-system', 'conduct-term', "manage/index.html"); 
setupButton('select-term-submit-btn-result', 'result-term',"result/index.html");
setupButton('select-term-submit-btn-announce', 'announce-term',"result/announce.html");