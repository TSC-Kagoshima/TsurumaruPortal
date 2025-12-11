const leagues = [
  { sport: "サッカー", name: "Aリーグ", teams: ["23R","26R","24R","28R"] },
  { sport: "サッカー", name: "Bリーグ", teams: ["25R","18R","16R","13R"] },
  { sport: "サッカー", name: "Cリーグ", teams: ["22R","15R","11R","21R"] },
  { sport: "サッカー", name: "Dリーグ", teams: ["17R","27R","14R","12R"] },
  { sport: "ドッジボール", name: "Aリーグ", teams: ["18R","12R","14R"] },
  { sport: "ドッジボール", name: "Bリーグ", teams: ["21R","22R","17R","13R"] },
  { sport: "ドッジボール", name: "Cリーグ", teams: ["26R","15R","24R","27R"] },
  { sport: "男子バスケットボール", name: "Aリーグ", teams: ["15R","13R","12R"] },
  { sport: "男子バスケットボール", name: "Bリーグ", teams: ["21R","23R","26R"] },
  { sport: "男子バスケットボール", name: "Cリーグ", teams: ["22R","16R","18R","14R"] },
  { sport: "男子バスケットボール", name: "Dリーグ", teams: ["17R","11R","27R","24R"] },
  { sport: "女子バスケットボール", name: "Aリーグ", teams: ["25R-A","26R","22R"] },
  { sport: "女子バスケットボール", name: "Bリーグ", teams: ["13R","25R-B","15R"] },
  { sport: "女子バスケットボール", name: "Cリーグ", teams: ["11R","16R-A","27R","12R"] },
  { sport: "女子バスケットボール", name: "Dリーグ", teams: ["18R","16R-B","28R","23R"] },
  { sport: "男子バレーボール", name: "Aリーグ", teams: ["15R","11R","16R"] },
  { sport: "男子バレーボール", name: "Bリーグ", teams: ["17R","24R","25R"] },
  { sport: "男子バレーボール", name: "Cリーグ", teams: ["28R-A","21R","26R"] },
  { sport: "男子バレーボール", name: "Dリーグ", teams: ["13R","28R-B","27R","18R"] },
  { sport: "女子バレーボール", name: "Aリーグ", teams: ["23R-A","16R","11R-A"] },
  { sport: "女子バレーボール", name: "Bリーグ", teams: ["23R-B","11R-B","14R"] },
  { sport: "女子バレーボール", name: "Cリーグ", teams: ["21R-A","12R","18R"] },
  { sport: "女子バレーボール", name: "Dリーグ", teams: ["13R","28R","21R-B","26R"] },
  { sport: "女子バレーボール", name: "Eリーグ", teams: ["25R","22R","24R","17R"] },
  { sport: "卓球", name: "Aリーグ", teams: ["14R","24R","28R"] },
  { sport: "卓球", name: "Bリーグ", teams: ["22R","13R","17R"] },
  { sport: "卓球", name: "Cリーグ", teams: ["11R","23R","25R","c"] }
];

// --- 試合結果例 ---
const results = [
  { sport: "サッカー", team1: "23R", score1: 1, team2: "26R", score2: 2, winner: "26R" },
  { sport: "女子バレーボール", team1: "23R-A", score1: 2, team2: "11R-A", score2: 0, winner: "23R-A" },
  { sport: "卓球", team1: "14R", score1: 2, team2: "24R", score2: 1, winner: "14R" }
];

// --- 競技選択 ---
const sports = [...new Set(leagues.map(l=>l.sport))];
const select = document.getElementById("sport-select");
sports.forEach(s=>select.appendChild(new Option(s,s)));
function createLayout(a) {
    const positions = layout[a];
    if (!positions) return;

    positions.forEach((pos, i) => {
        const div = document.createElement("div");
        const id = `${a}-${i + 1}`;
        div.id = id;
        div.classList.add("box");

        // 配置を適用
        div.style.top = pos.top;
        div.style.left = pos.left;

        document.body.appendChild(div);
    });
}
function renderLeagues(sportName){
  const container = document.getElementById('leagues-container');
  if (!container) return;

  container.innerHTML = "";

  const filtered = leagues.filter(l => l.sport === sportName);
  const totalLeagues = filtered.length;

  filtered.forEach((league, leagueIndex) => {
    const div = document.createElement('div');
    const className = `lg-${leagueIndex+1}-of-${totalLeagues}`;
    div.classList.add('league','filter','radius', className);
    div.innerHTML = `<h2>${league.sport} - ${league.name}</h2>`;

    const svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";

    const positions = [];
    const n = league.teams.length;

    // レスポンシブ用に % で座標を計算
    if(n === 4){
      positions.push(
        {x:20, y:30}, {x:80, y:30},
        {x:20, y:80}, {x:80, y:80}
      );
    } else if(n === 3){
      positions.push(
        {x:50, y:30},
        {x:20, y:80}, {x:80, y:80}
      );
    }

    league.teams.forEach((team,i)=>{
      const teamDiv = document.createElement('div');
      const safeSport = league.sport.replace(/[^a-zA-Z0-9_-]/g, "");
      const safeLeague = league.name.replace(/[^a-zA-Z0-9_-]/g, "");
      teamDiv.id = `box-${safeSport}-${safeLeague}-${i+1}`;

      const matches = results.filter(
        r => r.sport === league.sport && (r.team1 === team || r.team2 === team)
      );
      const win = matches.filter(m => m.winner === team).length;
      const lose = matches.length - win;
      const scoreFor = matches.reduce(
        (sum,m)=> sum + (m.team1 === team ? m.score1 : m.score2), 0
      );
      const scoreAgainst = matches.reduce(
        (sum,m)=> sum + (m.team1 === team ? m.score2 : m.score1), 0
      );

      teamDiv.classList.add('team','filter');
      if(win > 0) teamDiv.classList.add('winner');

      // px → % に変換
      teamDiv.style.position = "absolute";
      teamDiv.style.left = positions[i].x + "%";
      teamDiv.style.top = positions[i].y + "%";
      teamDiv.style.transform = "translate(-50%, -50%)"; // 中心基準

      teamDiv.innerHTML =
        `<div>${team}</div>
         <div class="info">${win}勝 ${lose}敗<br>${scoreFor}-${scoreAgainst}</div>`;

      div.appendChild(teamDiv);
    });

    // チーム間の線とスコア
    for(let i=0;i<n;i++){
      for(let j=i+1;j<n;j++){
        const line = document.createElementNS("http://www.w3.org/2000/svg","line");
        line.setAttribute("x1", positions[i].x + "%");
        line.setAttribute("y1", positions[i].y + "%");
        line.setAttribute("x2", positions[j].x + "%");
        line.setAttribute("y2", positions[j].y + "%");
        line.setAttribute("stroke", "#999");
        line.setAttribute("stroke-width", 2);
        svg.appendChild(line);

        const match = results.find(r =>
          r.sport === league.sport &&
          (
            (r.team1 === league.teams[i] && r.team2 === league.teams[j]) ||
            (r.team1 === league.teams[j] && r.team2 === league.teams[i])
          )
        );

        if(match){
          const scoreText = document.createElementNS("http://www.w3.org/2000/svg","text");
          const x = (positions[i].x + positions[j].x)/2 + "%";
          const y = (positions[i].y + positions[j].y)/2 + "%";
          scoreText.setAttribute("x", x);
          scoreText.setAttribute("y", y);
          scoreText.setAttribute("text-anchor", "middle");
          scoreText.setAttribute("dominant-baseline", "middle");
          scoreText.textContent = `${match.score1}-${match.score2}`;
          svg.appendChild(scoreText);
        }
      }
    }

    div.appendChild(svg);
    container.appendChild(div);
  });
}




// 初期描画
renderLeagues(sports[0]);

// 選択変更時
select.addEventListener("change",()=>renderLeagues(select.value));

const inner = document.querySelector('.time-table-inner');
const img = inner.querySelector('img');

let scale = 1;
let isDragging = false;
let startX, startY, scrollLeft, scrollTop;

// --- ドラッグスクロール ---
inner.addEventListener('mousedown', e => {
  isDragging = true;
  startX = e.pageX - inner.offsetLeft;
  startY = e.pageY - inner.offsetTop;
  scrollLeft = inner.scrollLeft;
  scrollTop = inner.scrollTop;
  inner.style.cursor = 'grabbing';
});
inner.addEventListener('mouseup', () => { isDragging = false; inner.style.cursor = 'grab'; });
inner.addEventListener('mouseleave', () => { isDragging = false; inner.style.cursor = 'grab'; });
inner.addEventListener('mousemove', e => {
  if(!isDragging) return;
  e.preventDefault();
  const x = e.pageX - inner.offsetLeft;
  const y = e.pageY - inner.offsetTop;
  inner.scrollLeft = scrollLeft - (x - startX);
  inner.scrollTop = scrollTop - (y - startY);
});

// --- Ctrl + ホイールでズーム (PC) ---
inner.addEventListener('wheel', e => {
  if(e.ctrlKey){
    e.preventDefault();
    scale += e.deltaY * -0.001;
    scale = Math.min(Math.max(0.5, scale), 3);
    img.style.transform = `scale(${scale})`;
  }
});

// --- タッチ（モバイル）ピンチズーム ---
let initialDistance = null;
let initialScale = scale;

inner.addEventListener('touchstart', e => {
  if(e.touches.length === 2){
    initialDistance = Math.hypot(
      e.touches[0].pageX - e.touches[1].pageX,
      e.touches[0].pageY - e.touches[1].pageY
    );
    initialScale = scale;
  }
});

inner.addEventListener('touchmove', e => {
  if(e.touches.length === 2 && initialDistance){
    e.preventDefault();
    const currentDistance = Math.hypot(
      e.touches[0].pageX - e.touches[1].pageX,
      e.touches[0].pageY - e.touches[1].pageY
    );
    scale = initialScale * (currentDistance / initialDistance);
    scale = Math.min(Math.max(0.5, scale), 3);
    img.style.transform = `scale(${scale})`;
  }
});

inner.addEventListener('touchend', e => {
  if(e.touches.length < 2) initialDistance = null;
});
