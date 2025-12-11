// --- リーグデータ ---
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

// --- 描画関数 ---
function renderLeagues(sportName){
  const container = document.getElementById('leagues-container');
  container.innerHTML = "";
  const filtered = leagues.filter(l=>l.sport===sportName);

  filtered.forEach(league=>{
    const div = document.createElement('div');
    div.classList.add('league');
    div.innerHTML = `<h2>${league.sport} - ${league.name}</h2>`;

    const svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
    const positions = [];
    const n = league.teams.length;

    if(n===4){
      positions.push({x:50, y:50},{x:250, y:50},{x:50, y:200},{x:250, y:200});
    } else if(n===3){
      positions.push({x:150, y:20},{x:50, y:200},{x:250, y:200});
    }

    league.teams.forEach((team,i)=>{
      const teamDiv = document.createElement('div');
      const matches = results.filter(r=>r.sport===league.sport&&(r.team1===team||r.team2===team));
      const win = matches.filter(m=>m.winner===team).length;
      const lose = matches.length-win;
      const scoreFor = matches.reduce((sum,m)=>sum+(m.team1===team?m.score1:m.score2),0);
      const scoreAgainst = matches.reduce((sum,m)=>sum+(m.team1===team?m.score2:m.score1),0);

      teamDiv.classList.add('team');
      if(win>0) teamDiv.classList.add('winner');
      teamDiv.style.left = positions[i].x+"px";
      teamDiv.style.top = positions[i].y+"px";
      teamDiv.innerHTML = `<div>${team}</div><div class="info">${win}勝 ${lose}敗<br>${scoreFor}-${scoreAgainst}</div>`;
      div.appendChild(teamDiv);
    });

    // 線とスコア
    for(let i=0;i<n;i++){
      for(let j=i+1;j<n;j++){
        const line = document.createElementNS("http://www.w3.org/2000/svg","line");
        line.setAttribute("x1", positions[i].x+40);
        line.setAttribute("y1", positions[i].y+20);
        line.setAttribute("x2", positions[j].x+40);
        line.setAttribute("y2", positions[j].y+20);
        svg.appendChild(line);

        const match = results.find(r=>r.sport===league.sport&&
          ((r.team1===league.teams[i]&&r.team2===league.teams[j])||
           (r.team1===league.teams[j]&&r.team2===league.teams[i])));
        if(match){
          const scoreText = document.createElementNS("http://www.w3.org/2000/svg","text");
          scoreText.setAttribute("x", (positions[i].x+positions[j].x+40)/2);
          scoreText.setAttribute("y", (positions[i].y+positions[j].y+20)/2 -5);
          scoreText.setAttribute("text-anchor","middle");
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