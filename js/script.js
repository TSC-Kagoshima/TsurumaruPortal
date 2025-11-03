        document.addEventListener('DOMContentLoaded', function() {
            const hamburger = document.querySelector('.hamburger');
            const navList = document.querySelector('.navList');
            const navLinks = document.querySelectorAll('.navList li a'); // すべてのリンク取得

            // ハンバーガークリックで開閉
            hamburger.addEventListener('click', function() {
                hamburger.classList.toggle('active'); // ×アニメーション
                navList.classList.toggle('show');     // メニュー表示
            });

            // li a をクリックしたらメニュー閉じる
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                hamburger.classList.remove('active'); // ×を戻す
                navList.classList.remove('show');     // メニュー非表示
                });
            });
        });