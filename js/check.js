// Cookie読み込み関数
function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

const email = getCookie("userEmail");

// 未ログインまたは不正メールならリダイレクト
if (!email || !email.endsWith("@kago.ed.jp")) {
  // 現在のURLを記録しておく
  sessionStorage.setItem("redirectAfterLogin", window.location.href);
  window.location.replace("https://tsurumaruportal.tsurubunsai.com/");
}
