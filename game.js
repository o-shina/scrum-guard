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

        switch (type) {
            case "stamp":
                osc.frequency.value = 150;
                osc.type = "square";
                gain.gain.setValueAtTime(0.3, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.1);
                break;
            case "correct":
                osc.frequency.value = 523;
                osc.type = "sine";
                gain.gain.setValueAtTime(0.2, ctx.currentTime);
                osc.start(ctx.currentTime);
                osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
                osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
                osc.stop(ctx.currentTime + 0.4);
                break;
            case "wrong":
                osc.frequency.value = 200;
                osc.type = "sawtooth";
                gain.gain.setValueAtTime(0.2, ctx.currentTime);
                osc.start(ctx.currentTime);
                osc.frequency.setValueAtTime(150, ctx.currentTime + 0.15);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                osc.stop(ctx.currentTime + 0.3);
                break;
            default:
                osc.stop(ctx.currentTime + 0.01);
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
        this.isTransitioning = false;
        this.transitionTimerIds = [];
        this.init();
    }

    init() {
        document.getElementById("start-btn").addEventListener("click", () => this.startGame());
        document.getElementById("approve-btn").addEventListener("click", () => this.judge(false));
        document.getElementById("deny-btn").addEventListener("click", () => this.judge(true));
        document.getElementById("next-btn").addEventListener("click", () => this.nextScenario());
        document.getElementById("restart-btn").addEventListener("click", () => this.restart());

        this.showScreen("title-screen");
    }

    clearTransitionTimers() {
        this.transitionTimerIds.forEach((id) => clearTimeout(id));
        this.transitionTimerIds = [];
    }

    queueTransition(fn, ms) {
        const id = setTimeout(() => {
            this.transitionTimerIds = this.transitionTimerIds.filter((t) => t !== id);
            fn();
        }, ms);
        this.transitionTimerIds.push(id);
    }

    setActionButtonsEnabled(enabled) {
        document.getElementById("approve-btn").disabled = !enabled;
        document.getElementById("deny-btn").disabled = !enabled;
    }

    setTransitioning(flag) {
        this.isTransitioning = flag;
        if (flag) {
            this.setActionButtonsEnabled(false);
        }
        document.body.classList.toggle("is-transitioning", flag);
    }

    resetState() {
        this.score = 0;
        this.strikes = 0;
        this.day = 1;
        this.currentScenario = null;
        this.scenarioIndex = 0;
        this.learned = [];
        this.correctCount = 0;
        this.totalCount = 0;
        this.shuffledScenarios = [];

        document.getElementById("score").textContent = "0";
        document.getElementById("strikes").textContent = "0";
        document.getElementById("day").textContent = "1";
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
        const easy = this.shuffleArray(SCENARIOS.filter((s) => s.difficulty === 1));
        const medium = this.shuffleArray(SCENARIOS.filter((s) => s.difficulty === 2));
        const hard = this.shuffleArray(SCENARIOS.filter((s) => s.difficulty === 3));

        return [...easy.slice(0, 3), ...medium.slice(0, 5), ...hard.slice(0, 4)];
    }

    startGame() {
        if (this.isTransitioning) return;

        try {
            this.clearTransitionTimers();
            this.resetState();
            this.shuffledScenarios = this.prepareScenarios();
            this.updateRules();
            this.showScreen("game-screen");
            this.loadScenario();
        } catch (e) {
            alert("ゲーム開始エラー: " + e.message);
        }
    }

    showScreen(screenId) {
        document.querySelectorAll(".screen").forEach((screen) => {
            const isActive = screen.id === screenId;
            screen.classList.toggle("active", isActive);
            screen.setAttribute("aria-hidden", isActive ? "false" : "true");
        });
    }

    updateRules() {
        const rulesList = document.getElementById("rules-list");
        const dayIndex = Math.min(this.day - 1, RULES_BY_DAY.length - 1);
        const todaysRules = RULES_BY_DAY[dayIndex] || [];

        rulesList.innerHTML = todaysRules.map((rule) => `<li>${rule}</li>`).join("");
    }

    loadScenario() {
        if (this.scenarioIndex >= this.shuffledScenarios.length) {
            this.endGame();
            return;
        }

        this.currentScenario = this.shuffledScenarios[this.scenarioIndex];
        const scenario = this.currentScenario;

        const avatar = document.getElementById("avatar");
        const booth = document.getElementById("booth-window");
        avatar.classList.remove("enter", "exit-approve");
        booth.classList.remove("arrest-in", "arrest-out");

        avatar.classList.add("enter");
        avatar.textContent = scenario.character.avatar;
        document.getElementById("role").textContent = scenario.character.role;
        document.getElementById("char-name").textContent = scenario.character.name;

        const teamDiv = document.getElementById("team-members");
        if (scenario.teamMembers && scenario.teamMembers.length > 0) {
            teamDiv.innerHTML = scenario.teamMembers.map((m) => `<span class="team-member">${m}</span>`).join("");
        } else {
            teamDiv.innerHTML = "";
        }

        document.getElementById("dialogue").textContent = scenario.dialogue;

        let docHtml = "";
        Object.entries(scenario.document).forEach(([key, value]) => {
            const label = this.getLabel(key);
            const isWarning = this.isWarningField(key, value);
            docHtml += `<div class="field"><span class="label">${label}:</span> <span class="value ${isWarning ? "warning" : ""}">${value}</span></div>`;
        });

        document.getElementById("document-content").innerHTML = docHtml;
        document.getElementById("stamp-area").innerHTML = "";

        this.setTransitioning(false);
        this.setActionButtonsEnabled(true);
    }

    getLabel(key) {
        const labels = {
            teamName: "チーム名",
            sprintLength: "スプリント期間",
            dailyScrum: "デイリースクラム",
            poParticipation: "PO参加",
            retrospective: "レトロスペクティブ",
            actionItems: "改善アクション",
            sprintGoal: "スプリントゴール",
            midSprintChange: "スプリント中変更",
            codeReview: "コードレビュー",
            knowledgeSharing: "知識共有",
            smRole: "SMの役割",
            teamAutonomy: "チーム自律性",
            notes: "備考",
            estimation: "見積もり",
            planningPoker: "プランニングポーカー",
            backlogRefinement: "バックログリファインメント",
            stakeholderComm: "ステークホルダー連携",
            sprintReview: "スプリントレビュー",
            stakeholderFeedback: "ステークホルダーFB",
            definitionOfDone: "完成の定義",
            testing: "テスト",
            impediments: "障害対応",
            teamSupport: "チーム支援",
            credential: "資格・経歴",
            transparency: "透明性",
            backlogPriority: "バックログ優先順位",
            poDecision: "PO意思決定",
            velocity: "ベロシティ",
            predictability: "予測可能性",
            focus: "フォーカス",
            deadline: "納期",
            qualityCompromise: "品質妥協",
            crossFunctional: "クロスファンクショナル",
            tShaped: "T型スキル",
            methodology: "手法",
            threeQuestions: "3つの質問"
        };

        return labels[key] || key;
    }

    isWarningField(_key, _value) {
        return false;
    }

    judge(isDeny) {
        if (this.isTransitioning || !this.currentScenario) return;

        this.setTransitioning(true);
        sound.play("stamp");

        const stampArea = document.getElementById("stamp-area");
        const stamp = document.createElement("div");
        stamp.className = `stamp ${isDeny ? "denied" : "approved"}`;
        stamp.textContent = isDeny ? "連行" : "通過";
        stampArea.appendChild(stamp);

        const isCorrect = isDeny === this.currentScenario.isAntipattern;
        this.totalCount += 1;

        const avatar = document.getElementById("avatar");
        const booth = document.getElementById("booth-window");
        avatar.classList.remove("enter");

        if (isDeny) {
            booth.classList.add("arrest-in");
            this.queueTransition(() => {
                booth.classList.add("arrest-out");
                booth.classList.remove("arrest-in");
            }, 500);
            this.queueTransition(() => {
                booth.classList.remove("arrest-out");
                this.showResult(isCorrect);
            }, 1100);
        } else {
            avatar.classList.add("exit-approve");
            this.queueTransition(() => {
                avatar.classList.remove("exit-approve");
                this.showResult(isCorrect);
            }, 800);
        }
    }

    showResult(isCorrect) {
        const scenario = this.currentScenario;
        const title = document.getElementById("result-title");
        const feedback = document.getElementById("result-feedback");

        if (isCorrect) {
            sound.play("correct");
            this.score += 100;
            this.correctCount += 1;
            title.textContent = "✓ 正解！";
            title.className = "correct";
        } else {
            sound.play("wrong");
            this.strikes += 1;
            title.textContent = "✗ 不正解...";
            title.className = "incorrect";
            document.getElementById("game-screen").classList.add("shake");
            this.queueTransition(() => {
                document.getElementById("game-screen").classList.remove("shake");
            }, 500);
        }

        feedback.innerHTML = `
            <p class="explanation">${scenario.explanation}</p>
            <p class="practice">✅ ベストプラクティス: ${scenario.practice}</p>
            <p class="antipattern">❌ アンチパターン: ${scenario.antipattern}</p>
        `;

        if (!this.learned.find((l) => l.practice === scenario.practice)) {
            this.learned.push({ practice: scenario.practice, antipattern: scenario.antipattern });
        }

        document.getElementById("score").textContent = this.score;
        document.getElementById("strikes").textContent = this.strikes;

        this.setTransitioning(false);
        this.showScreen("result-screen");
    }

    nextScenario() {
        if (this.isTransitioning) return;

        this.setTransitioning(true);

        if (this.strikes >= 3) {
            this.endGame();
            return;
        }

        this.scenarioIndex += 1;

        if (this.scenarioIndex % 2 === 0 && this.scenarioIndex > 0) {
            this.day += 1;
            document.getElementById("day").textContent = this.day;
            this.updateRules();
        }

        this.showScreen("game-screen");
        this.loadScenario();
    }

    getEnding() {
        const rate = this.totalCount === 0 ? 0 : this.correctCount / this.totalCount;

        if (rate >= 0.9) return { rank: "S", title: "伝説のスクラムマスター", msg: "あなたはスクラムの化身だ！ジェフもケンも認める実力。", color: "#ffd700" };
        if (rate >= 0.7) return { rank: "A", title: "優秀なアジャイルコーチ", msg: "チームを正しく導ける力がある。", color: "#4ecca3" };
        if (rate >= 0.5) return { rank: "B", title: "見習いスクラム実践者", msg: "もう少し学べば一人前になれる。", color: "#87ceeb" };
        if (rate >= 0.3) return { rank: "C", title: "アジャイル初心者", msg: "スクラムガイドを読み直そう。", color: "#f0a500" };
        return { rank: "D", title: "ウォーターフォール型信者", msg: "スクラムとウォーターフォールの区別がついていない…", color: "#e94560" };
    }

    endGame() {
        this.clearTransitionTimers();
        this.setTransitioning(false);
        this.setActionButtonsEnabled(false);

        const ending = this.getEnding();
        const rate = this.totalCount === 0 ? 0 : Math.round((this.correctCount / this.totalCount) * 100);

        document.getElementById("final-score").textContent = this.score;
        document.getElementById("final-stats").innerHTML =
            `<span style="font-size:3rem;color:${ending.color}">${ending.rank}</span><br>
             <span style="font-size:1.5rem;color:${ending.color}">${ending.title}</span><br>
             <span>${ending.msg}</span><br><br>
             正答率: ${this.correctCount}/${this.totalCount} (${rate}%)`;

        const learnedList = document.getElementById("learned-list");
        learnedList.innerHTML = this.learned.map((l) =>
            `<li><strong>✅</strong> ${l.practice}<br><small style="color:#ff8f8f">✗ ${l.antipattern}</small></li>`
        ).join("");

        this.showScreen("gameover-screen");
    }

    restart() {
        if (this.isTransitioning) return;
        this.startGame();
    }
}

const game = new ScrumGuard();
