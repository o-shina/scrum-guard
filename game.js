class SoundManager {
    constructor() {
        this.ctx = null;
    }
    
    init() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    play(type) {
        if (!this.ctx) this.init();
        const ctx = this.ctx;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        switch(type) {
            case 'stamp':
                osc.frequency.value = 150;
                osc.type = 'square';
                gain.gain.setValueAtTime(0.3, ctx.currentTime);
                gain.gain.exponentialDecayTo = 0.01;
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.1);
                break;
            case 'correct':
                osc.frequency.value = 523;
                osc.type = 'sine';
                gain.gain.setValueAtTime(0.2, ctx.currentTime);
                osc.start(ctx.currentTime);
                osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
                osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
                osc.stop(ctx.currentTime + 0.4);
                break;
            case 'wrong':
                osc.frequency.value = 200;
                osc.type = 'sawtooth';
                gain.gain.setValueAtTime(0.2, ctx.currentTime);
                osc.start(ctx.currentTime);
                osc.frequency.setValueAtTime(150, ctx.currentTime + 0.15);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                osc.stop(ctx.currentTime + 0.3);
                break;
        }
    }
}

const sound = new SoundManager();

class ScrumGuard {
    constructor() {
        this.score = 0;
        this.strikes = 0;
        this.day = 1;
        this.currentScenario = null;
        this.scenarioIndex = 0;
        this.learned = [];
        this.correctCount = 0;
        this.totalCount = 0;
        this.shuffledScenarios = [];
        this.init();
    }

    init() {
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.getElementById('approve-btn').addEventListener('click', () => this.judge(false));
        document.getElementById('deny-btn').addEventListener('click', () => this.judge(true));
        document.getElementById('next-btn').addEventListener('click', () => this.nextScenario());
        document.getElementById('restart-btn').addEventListener('click', () => this.restart());
    }

    shuffleArray(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    prepareScenarios() {
        // 難易度別にグループ化してシャッフル
        const easy = this.shuffleArray(SCENARIOS.filter(s => s.difficulty === 1));
        const medium = this.shuffleArray(SCENARIOS.filter(s => s.difficulty === 2));
        const hard = this.shuffleArray(SCENARIOS.filter(s => s.difficulty === 3));
        
        // 簡単→3つ、普通→5つ、難しい→4つの順で出題
        return [
            ...easy.slice(0, 3),
            ...medium.slice(0, 5),
            ...hard.slice(0, 4)
        ];
    }

    startGame() {
        this.shuffledScenarios = this.prepareScenarios();
        this.showScreen('game-screen');
        this.updateRules();
        this.loadScenario();
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
    }

    updateRules() {
        const rulesList = document.getElementById('rules-list');
        const dayIndex = Math.min(this.day - 1, RULES_BY_DAY.length - 1);
        rulesList.innerHTML = RULES_BY_DAY[dayIndex].map(r => `<li>${r}</li>`).join('');
    }

    loadScenario() {
        if (this.scenarioIndex >= this.shuffledScenarios.length) {
            this.endGame();
            return;
        }
        this.currentScenario = this.shuffledScenarios[this.scenarioIndex];
        const s = this.currentScenario;
        
        const avatar = document.getElementById('avatar');
        avatar.classList.remove('enter', 'exit');
        avatar.classList.add('enter');
        avatar.textContent = s.character.avatar;
        document.getElementById('role').textContent = s.character.role;
        document.getElementById('char-name').textContent = s.character.name;
        
        // チームメンバー表示
        const teamDiv = document.getElementById('team-members');
        if (s.teamMembers && s.teamMembers.length > 0) {
            teamDiv.innerHTML = s.teamMembers.map(m => `<span class="team-member">${m}</span>`).join('');
        } else {
            teamDiv.innerHTML = '';
        }
        
        document.getElementById('dialogue').textContent = s.dialogue;
        
        let docHtml = '';
        for (const [key, value] of Object.entries(s.document)) {
            const label = this.getLabel(key);
            const isWarning = this.isWarningField(key, value);
            docHtml += `<div class="field"><span class="label">${label}:</span> <span class="value ${isWarning ? 'warning' : ''}">${value}</span></div>`;
        }
        document.getElementById('document-content').innerHTML = docHtml;
        document.getElementById('stamp-area').innerHTML = '';
        
        document.getElementById('approve-btn').disabled = false;
        document.getElementById('deny-btn').disabled = false;
    }

    getLabel(key) {
        const labels = {
            teamName: 'チーム名',
            sprintLength: 'スプリント期間',
            dailyScrum: 'デイリースクラム',
            poParticipation: 'PO参加',
            retrospective: 'レトロスペクティブ',
            actionItems: '改善アクション',
            sprintGoal: 'スプリントゴール',
            midSprintChange: 'スプリント中変更',
            codeReview: 'コードレビュー',
            knowledgeSharing: '知識共有',
            smRole: 'SMの役割',
            teamAutonomy: 'チーム自律性',
            notes: '備考'
        };
        return labels[key] || key;
    }

    isWarningField(key, value) {
        const warnings = ['notes', 'midSprintChange'];
        return warnings.includes(key);
    }

    judge(isDeny) {
        document.getElementById('approve-btn').disabled = true;
        document.getElementById('deny-btn').disabled = true;
        
        sound.play('stamp');
        const stampArea = document.getElementById('stamp-area');
        const stamp = document.createElement('div');
        stamp.className = `stamp ${isDeny ? 'denied' : 'approved'}`;
        stamp.textContent = isDeny ? '連行' : '通過';
        stampArea.appendChild(stamp);
        
        const isCorrect = isDeny === this.currentScenario.isAntipattern;
        this.totalCount++;
        
        const avatar = document.getElementById('avatar');
        avatar.classList.remove('enter');
        avatar.classList.add('exit');
        setTimeout(() => this.showResult(isCorrect), 800);
    }

    showResult(isCorrect) {
        const s = this.currentScenario;
        const title = document.getElementById('result-title');
        const feedback = document.getElementById('result-feedback');
        
        if (isCorrect) {
            sound.play('correct');
            this.score += 100;
            this.correctCount++;
            title.textContent = '✓ 正解！';
            title.className = 'correct';
        } else {
            sound.play('wrong');
            this.strikes++;
            title.textContent = '✗ 不正解...';
            title.className = 'incorrect';
            document.getElementById('game-screen').classList.add('shake');
            setTimeout(() => document.getElementById('game-screen').classList.remove('shake'), 500);
        }
        
        feedback.innerHTML = `
            <p class="explanation">${s.explanation}</p>
            <p class="practice">✅ ベストプラクティス: ${s.practice}</p>
            <p class="antipattern">❌ アンチパターン: ${s.antipattern}</p>
        `;
        
        if (!this.learned.find(l => l.practice === s.practice)) {
            this.learned.push({ practice: s.practice, antipattern: s.antipattern });
        }
        
        document.getElementById('score').textContent = this.score;
        document.getElementById('strikes').textContent = this.strikes;
        
        this.showScreen('result-screen');
    }

    nextScenario() {
        if (this.strikes >= 3) {
            this.endGame();
            return;
        }
        this.scenarioIndex++;
        if (this.scenarioIndex % 2 === 0 && this.scenarioIndex > 0) {
            this.day++;
            document.getElementById('day').textContent = this.day;
            this.updateRules();
        }
        this.showScreen('game-screen');
        this.loadScenario();
    }

    getEnding() {
        const rate = this.correctCount / this.totalCount;
        if (rate >= 0.9) return { rank: 'S', title: '伝説のスクラムマスター', msg: 'あなたはスクラムの化身だ！ジェフもケンも認める実力。', color: '#ffd700' };
        if (rate >= 0.7) return { rank: 'A', title: '優秀なアジャイルコーチ', msg: 'チームを正しく導ける力がある。', color: '#4ecca3' };
        if (rate >= 0.5) return { rank: 'B', title: '見習いスクラム実践者', msg: 'もう少し学べば一人前になれる。', color: '#87ceeb' };
        if (rate >= 0.3) return { rank: 'C', title: 'アジャイル初心者', msg: 'スクラムガイドを読み直そう。', color: '#f0a500' };
        return { rank: 'D', title: 'ウォーターフォール型信者', msg: 'スクラムとウォーターフォールの区別がついていない…', color: '#e94560' };
    }

    endGame() {
        const ending = this.getEnding();
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('final-stats').innerHTML = 
            `<span style="font-size:3rem;color:${ending.color}">${ending.rank}</span><br>
             <span style="font-size:1.5rem;color:${ending.color}">${ending.title}</span><br>
             <span>${ending.msg}</span><br><br>
             正答率: ${this.correctCount}/${this.totalCount} (${Math.round(this.correctCount/this.totalCount*100) || 0}%)`;
        
        const learnedList = document.getElementById('learned-list');
        learnedList.innerHTML = this.learned.map(l => 
            `<li><strong>✅</strong> ${l.practice}<br><small style="color:#e94560">✗ ${l.antipattern}</small></li>`
        ).join('');
        
        this.showScreen('gameover-screen');
    }

    restart() {
        this.score = 0;
        this.strikes = 0;
        this.day = 1;
        this.scenarioIndex = 0;
        this.learned = [];
        this.correctCount = 0;
        this.totalCount = 0;
        document.getElementById('score').textContent = '0';
        document.getElementById('strikes').textContent = '0';
        document.getElementById('day').textContent = '1';
        this.startGame();
    }
}

const game = new ScrumGuard();
