const SCENARIOS = [
    {
        id: 1,
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
        id: 2,
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
        id: 3,
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
        id: 4,
        character: { avatar: "👩", role: "開発者", name: "山田" },
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
        id: 5,
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
    }
];

const RULES_BY_DAY = [
    ["デイリースクラムは毎日15分以内で実施", "スクラムマスターはマネージャーではない"],
    ["スプリント中のスコープ変更は禁止", "レトロスペクティブの改善は実行する"],
    ["チームは自己組織化されるべき", "知識の属人化を防ぐ"]
];
