function connectWS() {
  window.ws = new WebSocket("wss://fetch.tsurumarubroadcast.workers.dev/ws");

  window.ws.addEventListener("open", () => {
    console.log("WS connected");
  });

  window.ws.addEventListener("message", evt => {
    const msg = JSON.parse(evt.data);
    console.log("WS message:", msg);

    // 試合結果のリアルタイム受信
    if (msg.type === "game-result") {
      // ここに画面更新処理を書く
      console.log("Received game result:", msg.data);
    }
  });

  window.ws.addEventListener("close", () => {
    console.log("WS disconnected. Reconnecting...");
    setTimeout(connectWS, 1000);
  });
}

connectWS();
