const url = "https://classmatch.tsurumarubroadcast.workers.dev/";
let leagues = null;  // ← グローバル

document.addEventListener('DOMContentLoaded', async () => {
  localStorage.removeItem("resultsData");
localStorage.removeItem("leaguesData");
  leagues = await getLeaguesData(); // 取得してセット

  // --- 競技選択生成 ---
  const sports = [...new Set(leagues.map(l => l.sport))];
  const select = document.getElementById("sport-select");
  sports.forEach(s => select.appendChild(new Option(s, s)));

  // 初期描画
  renderLeagues(sports[0]);

  // 選択変更時
  select.addEventListener("change", () => renderLeagues(select.value));
});


// -----------------------------------------
// データ取得
// -----------------------------------------
async function getLeaguesData() {
  let leaguesStr = localStorage.getItem('leaguesData');
  let leagues;

  if (!leaguesStr || leaguesStr === JSON.stringify({ error: "unknown type" })) {

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        term: new URLSearchParams(location.search).get('term'),
        action: "getGames"
      }),
      headers: { "Content-Type": "application/json" }
    });

    const json = await response.json();

    // localStorage 保存
    localStorage.setItem('leaguesData', JSON.stringify(json));

    leagues = json;  // ← もう JSON.parse しなくてOK
  } else {

    leagues = JSON.parse(leaguesStr);  // ← ストレージから取る場合だけ解析する
  }

  console.log("leagues:", leagues);

  return leagues;  // ← ここは配列なので map できる
}




// -----------------------------------------
// リーグ描画（グローバル leagues を使う）
// -----------------------------------------
async function renderLeagues(sportName) {

  // 最新結果取得
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      term: new URLSearchParams(location.search).get("term"),
      action: "result"
    }),
    headers: { "Content-Type": "application/json" }
  });

  const results = await response.json();
  const resultsExist = results.length > 0;  // ←★ 追加：結果があるかどうか
console.log("results:", results);
console.log("Array?", Array.isArray(results));
  const container = document.getElementById("leagues-container");
  if (!container) return;

  container.innerHTML = "";

  const filtered = leagues.filter(l => l.sport === sportName);
  const totalLeagues = filtered.length;

  filtered.forEach((league, leagueIndex) => {
    const div = document.createElement("div");
    const className = `lg-${leagueIndex + 1}-of-${totalLeagues}`;
    div.classList.add("league", "filter", "radius", className);
    div.innerHTML = `<h2>${league.sport} - ${league.name}</h2>`;

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";

const teams = league.teams.filter(t => t && t.trim() !== "");
const n = teams.length;
let positions = [];

if (n === 4) {
  positions = [
    { x: 20, y: 30 }, { x: 80, y: 30 },
    { x: 20, y: 80 }, { x: 80, y: 80 }
  ];
} else if (n === 3) {
  positions = [
    { x: 50, y: 30 },
    { x: 20, y: 80 }, { x: 80, y: 80 }
  ];
} else {
  console.warn("未知のチーム数:", n, league);
  return; // 安全にスキップ
}


    // --- チーム描画 ---
    league.teams.forEach((team, i) => {
      const teamDiv = document.createElement("div");
      const safeSport = league.sport.replace(/[^a-zA-Z0-9_-]/g, "");
      const safeLeague = league.name.replace(/[^a-zA-Z0-9_-]/g, "");
      teamDiv.id = `box-${safeSport}-${safeLeague}-${i + 1}`;

      // ★ 試合結果が空の時は 0 にしておく
      let win = 0, lose = 0, scoreFor = 0, scoreAgainst = 0;

      if (resultsExist) {
        const matches = results.filter(
          r => r.sport === league.sport && (r.team1 === team || r.team2 === team)
        );

        win = matches.filter(m => m.winner === team).length;
        lose = matches.length - win;

        scoreFor = matches.reduce(
          (sum, m) => sum + (m.team1 === team ? m.score1 : m.score2), 0
        );
        scoreAgainst = matches.reduce(
          (sum, m) => sum + (m.team1 === team ? m.score2 : m.score1), 0
        );
      }

      teamDiv.classList.add("team", "filter");
      if (win > 0) teamDiv.classList.add("winner");

      teamDiv.style.position = "absolute";
      teamDiv.style.left = positions[i].x + "%";
      teamDiv.style.top = positions[i].y + "%";
      teamDiv.style.transform = "translate(-50%, -50%)";

      teamDiv.innerHTML = `
        <div>${team}</div>
        <div class="info">${win}勝 ${lose}敗<br>${scoreFor}-${scoreAgainst}</div>
      `;

      div.appendChild(teamDiv);
    });


    // --- 線（★結果がある時だけ描画） ---
    if (resultsExist) {
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
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

          if (match) {
            const scoreText = document.createElementNS("http://www.w3.org/2000/svg", "text");
            const x = (positions[i].x + positions[j].x) / 2 + "%";
            const y = (positions[i].y + positions[j].y) / 2 + "%";
            scoreText.setAttribute("x", x);
            scoreText.setAttribute("y", y);
            scoreText.setAttribute("text-anchor", "middle");
            scoreText.setAttribute("dominant-baseline", "middle");
            scoreText.textContent = `${match.score1}-${match.score2}`;
            svg.appendChild(scoreText);
          }
        }
      }
    }

    div.appendChild(svg);
    container.appendChild(div);
  });
}

