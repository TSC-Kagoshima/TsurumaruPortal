// 1) API base (一回だけ宣言)
const url = "https://fetch.tsurumarubroadcast.workers.dev/"; // for fetch
const wsUrl = "wss://fetch.tsurumarubroadcast.workers.dev/ws"; // for websocket

// 2) connect WS (single instance)
let ws = null;
function connectWS() {
  if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) return;
  ws = new WebSocket(wsUrl);

  ws.onopen = () => console.log("WS connected");
  ws.onmessage = (evt) => {
    let msg;
    try { msg = JSON.parse(evt.data); } catch (e) { console.warn("invalid ws json", e); return; }
    // msg could be {type:"commu", data: {...}} or raw {updated: true, data: [...]}
    if (msg.type === "commu" || msg.type === "update") {
      // if it's DO-broadcasted wrapper
      if (msg.data) {
        notice(msg.data);
      } else {
        console.warn("ws msg missing data", msg);
      }
    } else if (msg.updated && msg.data) {
      // legacy format
      notice(msg.data);
    } else {
      // if DO sends raw stringified object
      try {
        const parsed = JSON.parse(evt.data);
        if (parsed && parsed.data) notice(parsed.data);
      } catch (e) {}
    }
  };
  ws.onerror = (e) => console.error("WS error", e);
  ws.onclose = () => {
    console.warn("WS closed, reconnecting in 2s");
    setTimeout(connectWS, 2000);
  };
}
connectWS();

// 3) notice() with guards
function notice(rows) {
  if (!rows) { console.warn("notice(): empty rows", rows); return; }

  // if the worker sent { updated:true, data: [...] } directly, caller might pass that; handle both:
  const items = Array.isArray(rows) ? rows : (rows.data ?? rows);

  if (!items || !Array.isArray(items)) {
    console.warn("notice(): unexpected data shape", rows);
    return;
  }

  let html = "";
  const idMap = ["from", "to", "type", "content"];
  items.forEach(row => {
    const eValue = row[4]?.value ?? "";
    const fValue = row[5]?.value ?? "";
    html += `<div class='commulist filter radius ${eValue}' data-id="${fValue}">`;
    row.forEach((cell, cellIndex) => {
      const idValue = idMap[cellIndex] || `col${cellIndex}`;
      html += `<p class="commulist-${idValue}" style="font-weight:${cell?.bold ? "bold" : "normal"};">${cell?.value ?? ""}</p>`;
    });
    html += "</div>";
  });

  document.getElementById('commu-list').innerHTML = html;
}
