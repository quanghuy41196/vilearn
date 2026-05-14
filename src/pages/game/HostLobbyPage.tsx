import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Play,
  Volume2,
  Copy,
  Check,
  QrCode,
  Trophy,
  Clock,
  Sparkles,
} from "lucide-react";
import { mockGame, mockLeaderboard, mockQuizzes } from "../../data/mock";
import PlayerCard from "../../components/game/PlayerCard";

type Phase = "lobby" | "question" | "leaderboard" | "ended";

export default function HostLobbyPage() {
  const [phase, setPhase] = useState<Phase>("lobby");
  const [copied, setCopied] = useState(false);
  const [qIdx, setQIdx] = useState(0);
  const [timer, setTimer] = useState(20);
  const quiz = mockQuizzes[0];

  useEffect(() => {
    if (phase !== "question") return;
    if (timer === 0) {
      setPhase("leaderboard");
      return;
    }
    const t = setTimeout(() => setTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timer]);

  const copyPin = () => {
    navigator.clipboard.writeText(mockGame.pin);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (phase === "lobby") {
    return (
      <div className="min-h-[80vh] -m-6 p-6 bg-gradient-to-br from-indigo-900 via-violet-900 to-fuchsia-900 text-white rounded-none">
        <Link to="/quizzes" className="inline-flex items-center gap-1.5 text-sm text-indigo-200 hover:text-white">
          <ArrowLeft className="w-4 h-4" /> Quay lại
        </Link>

        <div className="max-w-5xl mx-auto mt-8">
          <div className="text-center mb-8">
            <p className="uppercase text-xs tracking-widest text-indigo-300 mb-2">Game show — chờ tham gia</p>
            <h1 className="text-4xl font-bold">{quiz.title}</h1>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white text-gray-900 rounded-2xl p-8 text-center">
              <p className="text-sm text-gray-500">Tham gia tại</p>
              <p className="text-3xl font-bold text-indigo-600 mt-1">vilearn.vn/play</p>
              <p className="text-sm text-gray-500 mt-6">Mã PIN</p>
              <div className="flex items-center justify-center gap-3 mt-2">
                <p className="text-6xl font-black tracking-widest text-gray-900">
                  {mockGame.pin}
                </p>
                <button onClick={copyPin} className="p-2 hover:bg-gray-100 rounded">
                  {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              <div className="mt-6 inline-block p-4 bg-white border-4 border-gray-200 rounded-xl">
                <div className="w-40 h-40 bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center text-white rounded">
                  <QrCode className="w-24 h-24" />
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <h3 className="font-semibold">Người chơi</h3>
                </div>
                <span className="badge bg-white/20 text-white">
                  {mockGame.players.length}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                {mockGame.players.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white/10 rounded-lg p-3 text-center animate-slide-up"
                  >
                    <p className="text-2xl">{p.avatar}</p>
                    <p className="text-sm font-medium truncate">{p.name}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
                <button className="text-sm text-indigo-200 hover:text-white flex items-center gap-1">
                  <Volume2 className="w-4 h-4" /> Bật nhạc
                </button>
                <button
                  onClick={() => {
                    setPhase("question");
                    setTimer(20);
                  }}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg"
                >
                  <Play className="w-5 h-5" /> Bắt đầu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "question") {
    const q = quiz.questions[qIdx];
    const colors = ["bg-rose-500", "bg-blue-500", "bg-amber-500", "bg-emerald-500"];
    return (
      <div className="min-h-[80vh] -m-6 p-8 bg-gradient-to-br from-indigo-900 via-violet-900 to-fuchsia-900 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-indigo-200">
              Câu {qIdx + 1} / {quiz.questions.length}
            </p>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <Clock className="w-4 h-4" />
              <span className="font-bold text-xl">{timer}</span>
            </div>
            <p className="text-sm text-indigo-200">
              <Users className="w-4 h-4 inline" /> {mockGame.players.length} người chơi
            </p>
          </div>

          <div className="bg-white text-gray-900 rounded-2xl p-10 text-center mb-6">
            <p className="text-3xl font-bold">{q.text}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {q.options.slice(0, 4).map((opt, i) => (
              <div
                key={opt.id}
                className={`${colors[i]} rounded-xl p-6 flex items-center gap-3 text-white shadow-lg`}
              >
                <span className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center font-bold">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="font-semibold text-lg">{opt.text}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setPhase("leaderboard")}
            className="mt-6 w-full bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 text-white font-bold py-3 rounded-lg"
          >
            Khoá câu trả lời
          </button>
        </div>
      </div>
    );
  }

  if (phase === "leaderboard") {
    return (
      <div className="min-h-[80vh] -m-6 p-8 bg-gradient-to-br from-indigo-900 via-violet-900 to-fuchsia-900 text-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2">Bảng xếp hạng</h2>
          <p className="text-center text-indigo-200 mb-8">
            Sau câu {qIdx + 1} / {quiz.questions.length}
          </p>

          <div className="space-y-3">
            {mockLeaderboard.map((p, i) => (
              <div
                key={p.name}
                className="bg-white text-gray-900 rounded-xl p-4 flex items-center gap-4 animate-slide-up"
              >
                <span
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                    i === 0 ? "bg-amber-400" : i === 1 ? "bg-gray-400" : i === 2 ? "bg-orange-400" : "bg-gray-300"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="text-3xl">{p.avatar}</span>
                <div className="flex-1">
                  <p className="font-semibold">{p.name}</p>
                  {p.streak > 0 && (
                    <p className="text-xs text-orange-600">🔥 chuỗi {p.streak}</p>
                  )}
                </div>
                <p className="text-2xl font-bold text-indigo-600">
                  {p.score.toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-3 mt-8">
            {qIdx < quiz.questions.length - 1 ? (
              <button
                onClick={() => {
                  setQIdx(qIdx + 1);
                  setTimer(20);
                  setPhase("question");
                }}
                className="bg-emerald-500 hover:bg-emerald-600 px-6 py-3 rounded-lg font-bold"
              >
                Câu tiếp →
              </button>
            ) : (
              <button
                onClick={() => setPhase("ended")}
                className="bg-amber-500 hover:bg-amber-600 px-6 py-3 rounded-lg font-bold"
              >
                <Trophy className="w-4 h-4 inline mr-2" /> Kết thúc trò chơi
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ended - podium
  return (
    <div className="min-h-[80vh] -m-6 p-8 bg-gradient-to-br from-indigo-900 via-violet-900 to-fuchsia-900 text-white">
      <div className="max-w-3xl mx-auto text-center">
        <Sparkles className="w-12 h-12 text-amber-400 mx-auto" />
        <h2 className="text-4xl font-bold mt-3">Kết thúc trò chơi</h2>
        <p className="text-indigo-200 mt-2">Chúc mừng các nhà vô địch!</p>

        <div className="flex items-end justify-center gap-4 mt-12">
          <Podium player={mockLeaderboard[1]} rank={2} height="h-32" />
          <Podium player={mockLeaderboard[0]} rank={1} height="h-44" />
          <Podium player={mockLeaderboard[2]} rank={3} height="h-24" />
        </div>

        <div className="mt-12 space-y-2 max-w-md mx-auto">
          {mockLeaderboard.slice(3).map((p, i) => (
            <PlayerCard
              key={p.name}
              player={{ id: p.name, name: p.name, avatar: p.avatar, score: p.score, streak: p.streak }}
              rank={i + 3}
            />
          ))}
        </div>

        <Link to="/quizzes" className="inline-block mt-10 bg-white text-indigo-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-100">
          Về danh sách bộ câu hỏi
        </Link>
      </div>
    </div>
  );
}

function Podium({
  player,
  rank,
  height,
}: {
  player: { name: string; avatar: string; score: number };
  rank: number;
  height: string;
}) {
  const colors = ["", "from-amber-400 to-amber-500", "from-gray-300 to-gray-400", "from-orange-400 to-orange-500"];
  return (
    <div className="flex flex-col items-center">
      <span className="text-5xl mb-2">{player.avatar}</span>
      <p className="font-semibold">{player.name}</p>
      <p className="text-amber-300 font-bold">{player.score.toLocaleString()}</p>
      <div
        className={`mt-3 w-24 ${height} bg-gradient-to-t ${colors[rank]} rounded-t-lg flex items-start justify-center pt-3 text-white font-black text-3xl shadow-lg`}
      >
        {rank}
      </div>
    </div>
  );
}
