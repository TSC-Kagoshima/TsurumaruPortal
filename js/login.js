   import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
      import {
        getAuth,
        GoogleAuthProvider,
        signInWithPopup,
        getRedirectResult,
        onAuthStateChanged,
        signOut,
        setPersistence,
    browserSessionPersistence
      } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDl6QhjgMwZKe17yjRomu_IMtKqPtTt-A8",
  authDomain: "tsurumaruportal.firebaseapp.com",
  projectId: "tsurumaruportal",
  storageBucket: "tsurumaruportal.firebasestorage.app",
  messagingSenderId: "844820135925",
  appId: "1:844820135925:web:cdfecc77e0fb3be2eaeabc",
  measurementId: "G-0LBJ1GWEWP"
};

      const app = initializeApp(firebaseConfig);
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();

      const loginBtn = document.getElementById("login");
      const logoutBtn = document.getElementById("logout");
      const loginArea = document.getElementById("loginArea");
      const locked = document.getElementById("locked");

setPersistence(auth, browserSessionPersistence)
  .then(() => signInWithPopup(auth, provider))
  .catch(console.error);

      
loginBtn.addEventListener("click", async () => {
  try {
    await signInWithPopup(auth, provider);
    // ここで結果は処理しない。onAuthStateChanged に任せる
  } catch (err) {
    console.error("ログイン失敗:", err);
  }
});

logoutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
    sessionStorage.clear();
    localStorage.clear();
    console.log("完全ログアウトしました");
    location.reload();
  } catch (err) {
    console.error("ログアウト失敗:", err);
  }
});

      // ページ復帰時のログイン結果処理
      getRedirectResult(auth)
        .then((result) => {
          if (result?.user) {
            console.log("ログイン成功:", result.user.email);
          }
        })
        .catch(console.error);

      // 状態監視（常時切替）
      onAuthStateChanged(auth, (user) => {
        if (user && user.email) {
          const email = user.email.toLowerCase();
                  console.log("ログイン検出:", user.email);
          if (email.endsWith("@kago.ed.jp")) {
            loginArea.style.display = "none";
            locked.style.display = "block";
          } else {
            alert("このサイトは @kago.ed.jp のアカウントのみ利用可能です。");
            signOut(auth);
            loginArea.style.display = "block";
            locked.style.display = "none";
          }
        } else {
          loginArea.style.display = "block";
          locked.style.display = "none";
        }
      });