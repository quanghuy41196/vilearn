import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Trophy, Clock, Sparkles, Check, X } from "lucide-react";
import { mockQuizzes } from "../../data/mock";

type Phase = "waiting" | "question" | "result" | "leaderboard" | "end";

export default function PlayerGamePage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("waiting");
  const [selected, setSelected] = useState<string | null>(null);
  const [time, setTime] = useState(20);
  const [score] = useState(2340);
  const [streak] = useState(2);
  const [qIdx, setQIdx] = useState(0);

  const quiz = mockQuizzes[0];
  const q = quiz.questions[qIdx];

  useEffect(() => {
    if (phase === "waiting") {
      const t = setTimeout(() => setPhase("question"), 2500);
      return () => clearTimeout(t);
    }
    if (phase === "question") {
      if (time === 0) {
        setPhase("result");
        return;
      }
      const t = setTimeout(() => setTime((s) => s - 1), 1000);
      return () => clearTimeout(t);
    }
    if (phase === "result") {
      const t = setTimeout(() => setPhase("leaderboard"), 2500);
      return () => clearTimeout(t);
    }
    if (phase === "leaderboard") {
      const t = setTimeout(() => {
        if (qIdx < quiz.questions.length - 1) {
          setQIdx(qIdx + 1);
          setSelected(null);
          setTime(20);
          setPhase("question");
        } else {
          setPhase("end");
        }
      }, 2500);
      return () => clearTimeout(t);
    }
  }, [phase, time, qIdx, quiz.questions.length]);

  const isCorrect = selected
    ? q.options.find((o) => o.id === selected)?.isCorrect
    : false;

  if (phase === "waiting") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-violet-700 text-white flex flex-col items-center justify-center p-4">
        <div className="text-6xl mb-4">🦁</div>
        <p className="text-2xl font-bold">Sư tử dũng cảm</p>
        <p className="text-indigo-200 mt-1">Đang chờ giáo viên bắt đầu...</p>
        <Loader2 className="w-8 h-8 animate-spin mt-6" />
      </div>
    );
  }

  if (phase === "question") {
    const colors = ["bg-rose-500", "bg-blue-500", "bg-amber-500", "bg-emerald-500"];
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-700 to-violet-800 text-white p-4 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <span className="badge bg-white/20 text-white">
            Câu {qIdx + 1} / {quiz.questions.length}
          </span>
          <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full">
            <Clock className="w-4 h-4" /> <span className="font-bold">{time}s</span>
          </div>
          <span className="badge bg-amber-400/30 text-amber-100">
            <Trophy className="w-3 h-3 mr-1" /> {score}
          </span>
        </div>

        <div className="bg-white text-gray-900 rounded-xl p-6 text-center mb-6">
          <p className="text-xl font-bold">{q.text}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 flex-1">
          {q.options.slice(0, 4).map((opt, i) => (
            <button
              key={opt.id}
              onClick={() => {
                if (selected) return;
                setSelected(opt.id);
                setTimeout(() => setPhase("result"), 800);
              }}
              disabled={!!selected}
              className={`${colors[i]} ${
                selected && selected !== opt.id ? "opacity-30" : ""
              } ${selected === opt.id ? "ring-4 ring-white scale-105" : ""} text-white rounded-xl flex items-center justify-center font-bold text-2xl transition-all`}
            >
              {String.fromCharCode(65 + i)}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (phase === "result") {
    return (
      <div
        className={`min-h-screen ${
          isCorrect ? "bg-emerald-500" : "bg-rose-500"
        } text-white flex flex-col items-center justify-center p-4`}
      >
        {isCorrect ? (
          <>
            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
              <Check className="w-14 h-14" strokeWidth={3} />
            </div>
            <p className="text-3xl font-bold mt-4">Chính xác!</p>
            <p className="text-emerald-100 mt-2">+450 điểm</p>
            {streak > 0 && (
              <p className="mt-3 bg-white/20 px-4 py-1.5 rounded-full text-sm">
                🔥 Chuỗi {streak + 1}
              </p>
            )}
          </>
        ) : (
          <>
            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
              <X className="w-14 h-14" strokeWidth={3} />
            </div>
            <p className="text-3xl font-bold mt-4">Chưa đúng</p>
            <p className="text-rose-100 mt-2">Đáp án đúng là</p>
            <p className="text-xl font-semibold mt-1">
              {q.options.find((o) => o.isCorrect)?.text}
            </p>
          </>
        )}
      </div>
    );
  }

  if (phase === "leaderboard") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-700 to-violet-800 text-white p-6 flex flex-col items-center justify-center">
        <Trophy className="w-12 h-12 text-amber-400" />
        <p className="text-3xl font-bold mt-3">Hạng 1 🥇</p>
        <p className="text-indigo-200 mt-2">Bạn đang dẫn đầu!</p>
        <div className="mt-6 bg-white/10 backdrop-blur rounded-xl p-5 text-center">
          <p className="text-sm text-indigo-200">Điểm số</p>
          <p className="text-4xl font-black mt-1">{(score + 450).toLocaleString()}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-violet-700 to-fuchsia-700 text-white p-6 flex flex-col items-center justify-center text-center">
      <Sparkles className="w-12 h-12 text-amber-400" />
      <h2 className="text-4xl font-bold mt-3">Hết game!</h2>
      <p className="text-6xl mt-6">🦁</p>
      <p className="text-2xl font-bold mt-3">Sư tử dũng cảm</p>
      <div className="mt-4 bg-white/10 backdrop-blur rounded-xl p-6">
        <p className="text-sm text-indigo-200">Tổng điểm</p>
        <p className="text-5xl font-black text-amber-300 mt-1">{(score + 450).toLocaleString()}</p>
        <p className="text-sm text-indigo-200 mt-3">Hạng cuối cùng</p>
        <p className="text-3xl font-bold mt-1">🥇 #1 / 12</p>
      </div>
      <button
        onClick={() => navigate("/game/join")}
        className="mt-8 bg-white text-indigo-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-100"
      >
        Chơi ván khác
      </button>
    </div>
  );
}
