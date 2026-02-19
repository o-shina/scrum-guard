const SCENARIOS = [
    // difficulty: 1=簡単, 2=普通, 3=難しい
    {
        id: 1,
        difficulty: 1,
        character: { avatar: "👨‍💼", role: "プロダクトオーナー", name: "田中" },
        dialogue: "「デイリースクラム？あー、私は忙しいから週一でまとめて報告受けるよ。」",
        document: {
            teamName: "チームアルファ",
            sprintLength: "2週間",
            dailyScrum: "週1回のみ",
            poParticipation: "スプリントレビューのみ参加",
            notes: "POがデイリースクラムに不参加"
        },
        isAntipattern: true,
        explanation: "デイリースクラムは「毎日」行うものです。POは必須ではありませんが、チームの状況を把握するために参加が推奨されます。",
        practice: "デイリースクラムは15分以内で12毎日実施する",
        antipattern: "デイリースクラムの頻度を下げる"
    },
    {
        id: 2, difficulty: 1,
        character: { avatar: "👩‍💻", role: "スクラムマスター", name: "鈴木" },
        dialogue: "「レトロスペクティブで決めた改善アクション、ちゃんと次のスプリントで実施してます！」",
        document: {
            teamName: "チームベータ",
            sprintLength: "2週間",
            retrospective: "毎スプリント実施",
            actionItems: "前回の改善アクション3件を実施済み",
            notes: "継続的な改善サイクルが機能"
        },
        isAntipattern: false,
        explanation: "レトロスペクティブで決めた改善アクションを実際に実行するのは素晴らしいプラクティスです。",
        practice: "レトロスペクティブの改善アクションを必ず実行する",
        antipattern: "レトロスペクティブが反省会だけで終わる"
    },
    {
        id: 3, difficulty: 1,
        character: { avatar: "👨", role: "テックリード", name: "佐藤" },
        dialogue: "「スプリント中だけど、上から緊急の追加要件が来たから入れるよ。」",
        document: {
            teamName: "チームガンマ",
            sprintLength: "2週間",
            sprintGoal: "ユーザー認証機能の完成",
            midSprintChange: "スプリント中に要件追加あり",
            notes: "スプリントバックログが頻繁に変更される"
        },
        isAntipattern: true,
        explanation: "スプリント中のスコープ変更はアンチパターンです。スプリントバックログはスプリント中は保護されるべきです。",
        practice: "スプリントバックログはスプリント中変更しない",
        antipattern: "スプリント中に要件を追加する"
    },
    {
        id: 4, difficulty: 1,
        character: { avatar: "👩", role: "開発者", name: "山田" },
        teamMembers: ["👨‍💻", "👩‍💻", "🧑‍💻"],
        dialogue: "「私たちのチームはペアプロでコードレビューして、知識を共有してます！」",
        document: {
            teamName: "チームデルタ",
            sprintLength: "2週間",
            codeReview: "ペアプロで実施",
            knowledgeSharing: "定期的な勉強会あり",
            notes: "チーム全員がコードを理解できる状態"
        },
        isAntipattern: false,
        explanation: "ペアプログラミングと知識共有はチームの集合知を高める良いプラクティスです。",
        practice: "チームで知識を共有し、属人化を防ぐ",
        antipattern: "特定の人しか知らないコードがある"
    },
    {
        id: 5, difficulty: 1,
        character: { avatar: "👴", role: "部長", name: "高橋" },
        dialogue: "「スクラムマスターには進捗報告をしっかりさせてるから大丈夫だ。」",
        document: {
            teamName: "チームイプシロン",
            sprintLength: "2週間",
            smRole: "マネージャーへの進捗報告",
            teamAutonomy: "低い",
            notes: "SMが上司への報告係になっている"
        },
        isAntipattern: true,
        explanation: "スクラムマスターはマネージャーではなく、チームのサーバントリーダーです。報告係ではありません。",
        practice: "SMはチームの障害を取り除く役割",
        antipattern: "SMを進捗管理や報告係にする"
    },
    // --- 追加シナリオ 6-10 ---
    {
        id: 6, difficulty: 2,
        character: { avatar: "👨‍🦳", role: "開発者", name: "伊藤" },
        dialogue: "「見積もりは私が全部やっておきました。効率的でしょ？」",
        document: {
            teamName: "チームゼータ",
            sprintLength: "2週間",
            estimation: "リーダーが単独で実施",
            planningPoker: "未実施",
            notes: "チーム全員での見積もりをしていない"
        },
        isAntipattern: true,
        explanation: "見積もりはチーム全員で行うべきです。プランニングポーカーなどで全員の知見を集めることで精度が上がります。",
        practice: "見積もりはチーム全員で行う",
        antipattern: "一人が見積もりを決める"
    },
    {
        id: 7, difficulty: 2,
        character: { avatar: "👩‍🦰", role: "プロダクトオーナー", name: "中村" },
        dialogue: "「バックログは優先順位つけて整理してます。ステークホルダーとも定期的に話してます。」",
        document: {
            teamName: "チームイータ",
            sprintLength: "2週間",
            backlogRefinement: "週1回実施",
            stakeholderComm: "定期的に実施",
            notes: "バックログが常に整理されている"
        },
        isAntipattern: false,
        explanation: "POがバックログを適切に管理し、ステークホルダーと連携するのは理想的です。",
        practice: "バックログリファインメントを定期的に行う",
        antipattern: "バックログが整理されていない"
    },
    {
        id: 8, difficulty: 2,
        character: { avatar: "👴", role: "マネージャー", name: "渡辺" },
        dialogue: "「スプリントレビュー？デモ見せてもらえればいいよ。フィードバックは特にないかな。」",
        document: {
            teamName: "チームシータ",
            sprintLength: "2週間",
            sprintReview: "デモのみ実施",
            stakeholderFeedback: "ほぼなし",
            notes: "レビューがデモ会になっている"
        },
        isAntipattern: true,
        explanation: "スプリントレビューは単なるデモではありません。ステークホルダーからフィードバックを得て、プロダクトバックログを調整する場です。",
        practice: "スプリントレビューでフィードバックを収集する",
        antipattern: "スプリントレビューがデモだけで終わる"
    },
    {
        id: 9, difficulty: 2,
        character: { avatar: "👨‍💻", role: "開発者", name: "小林" },
        dialogue: "「Doneの定義？まあ動けばDoneでしょ。テストはあとで誰かやるよ。」",
        document: {
            teamName: "チームイオタ",
            sprintLength: "2週間",
            definitionOfDone: "明文化されていない",
            testing: "後回し",
            notes: "完成の定義が曖昧"
        },
        isAntipattern: true,
        explanation: "Definition of Done（完成の定義）はチームで明確に定義し、全員が守るべきです。",
        practice: "Doneの定義を明確にし、遵守する",
        antipattern: "完成の定義が曖昧なまま進める"
    },
    {
        id: 10, difficulty: 2,
        character: { avatar: "👩‍🔬", role: "スクラムマスター", name: "加藤" },
        dialogue: "「チームの障害を取り除くのが私の仕事。今日も他部署と調整してきました！」",
        document: {
            teamName: "チームカッパ",
            sprintLength: "2週間",
            impediments: "SMが積極的に解決",
            teamSupport: "環境整備に注力",
            notes: "SMがサーバントリーダーとして機能"
        },
        isAntipattern: false,
        explanation: "スクラムマスターがチームの障害を取り除き、チームが集中できる環境を作るのは正しい役割です。",
        practice: "SMはチームの障害を取り除く",
        antipattern: "SMが障害を放置する"
    },
    // --- 追加シナリオ 11-15 + レジェンド ---
    {
        id: 11, difficulty: 2,
        character: { avatar: "👨‍🏫", role: "スクラム共同創設者", name: "ジェフ・サザーランド" },
        dialogue: "「Scrum is not a methodology. It's a framework. The team decides how to do the work.」",
        document: {
            teamName: "スクラムアライアンス",
            sprintLength: "1-4週間",
            teamAutonomy: "チームが自己組織化",
            credential: "スクラムガイド共同執筆者",
            notes: "フレームワークの本質を理解している"
        },
        isAntipattern: false,
        explanation: "ジェフ・サザーランド氏はスクラムの共同創設者。スクラムは方法論ではなくフレームワークであり、チームがやり方を決めます。",
        practice: "スクラムはフレームワーク、チームが自律的に動く",
        antipattern: "スクラムを厳密なルールとして強制する"
    },
    {
        id: 12, difficulty: 2,
        character: { avatar: "🧔", role: "スクラム共同創設者", name: "ケン・シュエイバー" },
        dialogue: "「Scrum exposes the truth. It doesn't solve your problems, it makes them visible.」",
        document: {
            teamName: "Scrum.org",
            sprintLength: "1-4週間",
            transparency: "透明性を重視",
            credential: "スクラムガイド共同執筆者",
            notes: "スクラムの精神を体現している"
        },
        isAntipattern: false,
        explanation: "ケン・シュエイバー氏はスクラムの共同創設者。スクラムは問題を可視化するフレームワークです。",
        practice: "スクラムで問題を可視化し、改善する",
        antipattern: "問題を隠してスクラムを形骸化する"
    },
    {
        id: 13, difficulty: 3,
        character: { avatar: "👨‍✈️", role: "アジャイルコーチ", name: "ジェフ・サザーランド(??)" },
        dialogue: "「スクラムは毎日3時間のミーティングが必須だよ。私が作ったんだから。」",
        document: {
            teamName: "フェイクコンサル",
            sprintLength: "1ヶ月",
            dailyScrum: "3時間",
            credential: "自称スクラム創設者",
            notes: "デイリースクラムは15分が基本"
        },
        isAntipattern: true,
        explanation: "これは偶物です！デイリースクラムは15分以内が基本。本物のジェフはそんなこと言いません。",
        practice: "デイリースクラムは15分以内",
        antipattern: "デイリースクラムを長時間の会議にする"
    },
    {
        id: 14, difficulty: 3,
        character: { avatar: "🧔‍♂️", role: "アジャイル専門家", name: "ケン・シュエイバー(??)" },
        dialogue: "「スクラムマスターはチームのボスだよ。タスクを割り振るのが仕事さ。」",
        document: {
            teamName: "フェイクアジャイル",
            sprintLength: "2週間",
            smRole: "タスク管理者",
            credential: "自称スクラム創設者",
            notes: "SMはマネージャーではない"
        },
        isAntipattern: true,
        explanation: "これは偶物です！スクラムマスターはマネージャーではなくサーバントリーダー。タスク割り振りはしません。",
        practice: "SMはサーバントリーダー、ボスではない",
        antipattern: "SMをマネージャーやボスとして扱う"
    },
    {
        id: 15, difficulty: 1,
        character: { avatar: "👩‍🚀", role: "開発者", name: "松本" },
        dialogue: "「昨日やったこと、今日やること、困ってること。シンプルに共有してます！」",
        document: {
            teamName: "チームラムダ",
            sprintLength: "2週間",
            dailyScrum: "毎日15分",
            threeQuestions: "実践中",
            notes: "デイリースクラムが機能している"
        },
        isAntipattern: false,
        explanation: "デイリースクラムの3つの質問（昨日・今日・障害）を守って短く共有するのは良いプラクティスです。",
        practice: "デイリースクラムは3つの質問で短く",
        antipattern: "デイリースクラムが報告会になる"
    },
    // --- 追加シナリオ 16-20 ---
    {
        id: 16, difficulty: 2,
        character: { avatar: "👨‍💼", role: "プロダクトオーナー", name: "山内" },
        dialogue: "「バックログの優先順位？まあ、都度変わるけどいいよね？」",
        document: {
            teamName: "チームミュー",
            sprintLength: "2週間",
            backlogPriority: "頻繁に変更",
            poDecision: "曖昧",
            notes: "POが優先順位を明確にしていない"
        },
        isAntipattern: true,
        explanation: "プロダクトオーナーはバックログの優先順位を明確にし、チームに明確な方向性を示す必要があります。",
        practice: "POはバックログの優先順位を明確にする",
        antipattern: "優先順位が曖昧なまま進める"
    },
    {
        id: 17, difficulty: 2,
        character: { avatar: "👩‍🏭", role: "スクラムマスター", name: "清水" },
        dialogue: "「ベロシティが安定してきたので、予測可能なデリバリーができてます！」",
        document: {
            teamName: "チームニュー",
            sprintLength: "2週間",
            velocity: "安定（20-25pt）",
            predictability: "高い",
            notes: "ベロシティが安定している"
        },
        isAntipattern: false,
        explanation: "ベロシティが安定すると予測可能性が高まり、計画が立てやすくなります。",
        practice: "ベロシティを計測し予測可能性を高める",
        antipattern: "ベロシティを無視して計画を立てる"
    },
    {
        id: 18, difficulty: 2,
        character: { avatar: "👨‍🎨", role: "開発者", name: "木村" },
        dialogue: "「スプリントゴールがないけど、とりあえずタスクこなしてます。」",
        document: {
            teamName: "チームクシー",
            sprintLength: "2週間",
            sprintGoal: "未設定",
            focus: "タスク消化のみ",
            notes: "スプリントゴールがない"
        },
        isAntipattern: true,
        explanation: "スプリントゴールはチームの方向性を統一する重要な要素です。必ず設定しましょう。",
        practice: "スプリントゴールを明確に設定する",
        antipattern: "スプリントゴールなしで進める"
    },
    {
        id: 19, difficulty: 3,
        character: { avatar: "👵", role: "部長", name: "森" },
        dialogue: "「スクラム入れても納期は絶対守れよ。品質？後でいい。」",
        document: {
            teamName: "チームオメガ",
            sprintLength: "2週間",
            deadline: "絶対遵守",
            qualityCompromise: "あり",
            notes: "品質を犠牲にして納期を守る圧力"
        },
        isAntipattern: true,
        explanation: "アジャイルでは品質は交渉不可。スコープを調整して品質を保ちましょう。",
        practice: "品質は交渉不可、スコープで調整",
        antipattern: "納期のために品質を犠牲にする"
    },
    {
        id: 20, difficulty: 3,
        character: { avatar: "🧑‍💻", role: "開発チーム", name: "チームパイ" },
        teamMembers: ["👨‍💻", "👩‍🎨", "🧑‍🔬", "👩‍💼"],
        dialogue: "「私たちはクロスファンクショナルなチームです。誰でもどのタスクもできます！」",
        document: {
            teamName: "チームパイ",
            sprintLength: "2週間",
            crossFunctional: "完全に実現",
            tShaped: "メンバー全員T型スキル",
            notes: "自己完結型チームが実現できている"
        },
        isAntipattern: false,
        explanation: "クロスファンクショナルなチームはスクラムの理想。外部依存なく価値を届けられます。",
        practice: "クロスファンクショナルなチームを作る",
        antipattern: "サイロ化された専門チームのまま"
    },
    // --- シナリオ 21: スクラム開発問題 ---
    {
        id: 21, difficulty: 3,
        character: { avatar: "👨‍💼", role: "コンサルタント", name: "橋本" },
        dialogue: "「弊社ではスクラム開発を導入しています。アジャイル開発の一種ですよね！」",
        document: {
            teamName: "株式会社ブリッジ",
            methodology: "スクラム開発",
            sprintLength: "2週間",
            notes: "「スクラム開発」という表現を使用"
        },
        isAntipattern: true,
        explanation: "「スクラム」は名詞（フレームワーク名）なので、「スクラム開発」だと「スクラムを開発している」という意味になってしまいます。正しくは「スクラムを用いた開発」「スクラムでの開発」です。一方「アジャイル」は形容詞なので「アジャイル開発（機敏な開発）」は正しい表現です。",
        practice: "「スクラムを用いた開発」「スクラムでの開発」と言う",
        antipattern: "「スクラム開発」と言う（スクラムは名詞）"
    }
];

const RULES_BY_DAY = [
    ["デイリースクラムは毎日15分以内で実施", "スクラムマスターはマネージャーではない"],
    ["スプリント中のスコープ変更は禁止", "レトロスペクティブの改善は実行する"],
    ["チームは自己組織化されるべき", "知識の属人化を防ぐ"],
    ["Doneの定義を明確にする", "見積もりはチーム全員で行う"],
    ["スプリントゴールを必ず設定する", "スクラムはフレームワークであり方法論ではない"],
    ["品質は交渉不可", "クロスファンクショナルチームを目指す"]
];
