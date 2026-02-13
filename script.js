    // 1. ハンバーガーメニュー
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.global-nav');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
    });

    const navLinks = document.querySelectorAll('.global-nav li a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
        });
    });

    // 2. フェードイン（スクロール監視）
    const options = {
        root: null,
        rootMargin: "0px",
        threshold: 0.2
    };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, options);
    document.querySelectorAll('.fade-in').forEach(target => {
        observer.observe(target);
    });

    // 3. アコーディオン（FAQ）
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            question.parentNode.classList.toggle('open');
        });
    });

    // 4. 数字のカウントアップ
    const countObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const targetNum = Number(counter.getAttribute('data-target'));
                let count = 0;
                const duration = 2000;
                const interval = 20;
                const step = targetNum / (duration / interval);
                
                const timer = setInterval(() => {
                    count += step;
                    if (count >= targetNum) {
                        count = targetNum;
                        clearInterval(timer);
                    }
                    counter.textContent = Math.floor(count);
                }, interval);
                observer.unobserve(counter);
            }
        });
    });
    document.querySelectorAll('.count-up').forEach(num => {
        countObserver.observe(num);
    });

    // 5. 創部年数の自動計算
    document.addEventListener("DOMContentLoaded", function() {
        const startYear = 2015;
        const currentYear = new Date().getFullYear();
        const years = currentYear - startYear;

        const historyText = document.getElementById('team-history');
        if (historyText) {
            historyText.textContent = years;
        }

        const countUpNumber = document.getElementById('count-years');
        if (countUpNumber) {
            countUpNumber.setAttribute('data-target', years);
        }
    });

    // 6. スケジュールの自動取得と表示
    
    const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSaLeTWPmUV76SsQBuYffzCRj3-Smi9G0RoFBJwNdS6dAPfLIq21a4OMVvOIYlGKuJn9ejakbURcpqR/pub?gid=0&single=true&output=csv';

    async function fetchSchedule() {
        const container = document.getElementById('schedule-list');
        
        try {
            const res = await fetch(csvUrl);
            // エラー処理
            if (!res.ok) throw new Error('Network response was not ok');
            
            const data = await res.text();
            const rows = data.split('\n').slice(1); // 1行目(ヘッダー)を削除
            
            // 中身を一旦クリア
            container.innerHTML = '';

            if (rows.length === 0 || rows[0] === "") {
                container.innerHTML = '<p style="text-align:center;">現在予定されているスケジュールはありません。</p>';
                return;
            }

            rows.forEach((row, index) => {
                // CSVのカンマ区切りを配列にする（簡易処理）
                const columns = row.split(',');
                
                // 空行対策
                if (columns.length < 4) return;

                // 列の割り当て
                // 0:日付, 1:時間, 2:場所, 3:内容
                const date = columns[0].replace(/"/g, ''); // 余分な"を削除
                const time = columns[1].replace(/"/g, '');
                const place = columns[2].replace(/"/g, '');
                const content = columns[3].replace(/"/g, '');

                // カード要素を作成
                const card = document.createElement('div');
                card.className = 'schedule-card';
                
                // 「試合」または「公式戦」または「大会」が含まれていたら...
                if (content.includes('公式戦') || content.includes('大会')) {
                    card.classList.add('match');
                }

                // 順番にアニメーションさせるための遅延設定
                card.style.animationDelay = `${index * 0.15}s`;

                // カードの中身（HTML）
                card.innerHTML = `
                    <div class="card-date">
                        <span class="date-main">${date.split('(')[0]}</span>
                        <span class="date-week">(${date.split('(')[1] || ''}</span>
                    </div>
                    <div class="card-info">
                        <div class="info-title">${content}</div>
                        <div class="info-sub">
                            <span><i class="material-icons">schedule</i> ${time}</span>
                            <span><i class="material-icons">place</i> ${place}</span>
                        </div>
                    </div>
                `;

                container.appendChild(card);
            });

        } catch (error) {
            console.error('スケジュールの読み込みに失敗しました:', error);
            container.innerHTML = '<p style="text-align:center; color:red;">スケジュールの読み込みに失敗しました。</p>';
        }
    }

    // ページ読み込み時に実行
    document.addEventListener("DOMContentLoaded", fetchSchedule);