import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  setPersistence,
  browserSessionPersistence,
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDl6QhjgMwZKe17yjRomu_IMtKqPtTt-A8",
  authDomain: "tsurumaruportal.firebaseapp.com",
  projectId: "tsurumaruportal",
  storageBucket: "tsurumaruportal.firebasestorage.app",
  messagingSenderId: "844820135925",
  appId: "1:844820135925:web:cdfecc77e0fb3be2eaeabc",
  measurementId: "G-0LBJ1GWEWP",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const loginBtn = document.getElementById("login");
const logoutBtn = document.getElementById("logout");
const loginArea = document.getElementById("loginArea");
const locked = document.getElementById("locked");

// Cookieをセットする関数
function setCookie(name, value, days = 1) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; secure; samesite=strict; expires=${date.toUTCString()}`;
}

// Cookieを削除
function clearCookie(name) {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
}

// Firebaseセッション設定
setPersistence(auth, browserSessionPersistence);

// ログインボタン押下時
loginBtn.addEventListener("click", async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (err) {
    console.error("ログイン失敗:", err);
  }
});

// ログアウト
logoutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
    sessionStorage.clear();
    localStorage.clear();
    clearCookie("userEmail");
    console.log("完全ログアウトしました");
    location.reload();
  } catch (err) {
    console.error("ログアウト失敗:", err);
  }
});

// 状態監視（ログイン／ログアウトの切り替え）
onAuthStateChanged(auth, (user) => {
  if (user && user.email) {
    const email = user.email.toLowerCase();
    console.log("ログイン検出:", email);

    if (email.endsWith("@kago.ed.jp")) {
      setCookie("userEmail", email);

      // 前のページURLを保持しておく（戻る用）
      const redirectUrl = sessionStorage.getItem("redirectAfterLogin") || "https://tsurumaruportal.tsurubunsai.com/home/";
      sessionStorage.removeItem("redirectAfterLogin");
      window.location.replace(redirectUrl);
    } else {
      alert("このサイトは @kago.ed.jp のアカウントのみ利用可能です。");
      signOut(auth);
      clearCookie("userEmail");
      window.location.replace("https://tsurumaruportal.tsurubunsai.com");
    }
  } else {
    loginArea.style.display = "block";
    locked.style.display = "none";
  }
});
