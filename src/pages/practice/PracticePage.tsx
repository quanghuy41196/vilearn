import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Brain,
  Clock,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Trophy,
  Layers,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { mockQuizzes } from "../../data/mock";
import QuestionCard from "../../components/quiz/QuestionCard";
import type { FlashcardRating } from "../../types";

type Mode = "select" | "test" | "flashcard" | "results";

export default function PracticePage() {
  const { id } = useParams();
  const quiz = useMemo(() => mockQuizzes.find((q) => q.id === id) ?? mockQuizzes[0], [id]);

  const [mode, setMode] = useState<Mode>("select");
  const [cur, setCur] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [time, setTime] = useState(0);
  const [flip, setFlip] = useState(false);
  const [ratings, setRatings] = useState<Record<string, FlashcardRating>>({});

  useEffect(() => {
    if (mode !== "test") return;
    const t = setInterval(() => setTime((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [mode]);

  const fmtTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const startTest = () => {
    setMode("test");
    setCur(0);
    setAnswers({});
    setTime(0);
  };
  const startFlash = () => {
    setMode("flashcard");
    setCur(0);
    setFlip(false);
    setRatings({});
  };

  const finishTest = () => setMode("results");

  const score = quiz.questions.reduce((acc, q) => {
    const ans = answers[q.id];
    const correctOpt = q.options.find((o) => o.isCorrect);
    return acc + (ans === correctOpt?.id ? 1 : 0);
  }, 0);

  if (mode === "select") {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Link to="/quizzes" className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4" /> Quay lại
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
          <p className="text-gray-500 mt-1">{quiz.description}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={startTest}
            className="card p-6 text-left hover:shadow-md transition-shadow group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mb-3">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 text-lg">Chế độ Kiểm tra</h3>
            <p className="text-sm text-gray-500 mt-1">
              Trả lời tất cả {quiz.questions.length} câu hỏi có giới hạn thời gian.
              Xem điểm số ở cuối.
            </p>
            <span className="text-sm text-indigo-600 font-medium mt-3 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
              Bắt đầu <ChevronRight className="w-4 h-4" />
            </span>
          </button>

          <button
            onClick={startFlash}
            className="card p-6 text-left hover:shadow-md transition-shadow group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-3">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 text-lg">Chế độ Flashcard</h3>
            <p className="text-sm text-gray-500 mt-1">
              Lật thẻ để xem đáp án, tự đánh giá mức độ ghi nhớ. Tích hợp ôn tập ngắt quãng.
            </p>
            <span className="text-sm text-emerald-600 font-medium mt-3 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
              Bắt đầu <ChevronRight className="w-4 h-4" />
            </span>
          </button>
        </div>
      </div>
    );
  }

  if (mode === "test") {
    const q = quiz.questions[cur];
    return (
      <div className="max-w-3xl mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setMode("select")}
            className="text-sm text-gray-600 hover:text-gray-900 inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> Thoát
          </button>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-indigo-600">{cur + 1}</span> /{" "}
              {quiz.questions.length}
            </div>
            <div className="badge bg-gray-100 text-gray-700 gap-1">
              <Clock className="w-3 h-3" /> {fmtTime(time)}
            </div>
          </div>
        </div>

        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 transition-all"
            style={{ width: `${((cur + 1) / quiz.questions.length) * 100}%` }}
          />
        </div>

        <QuestionCard
          question={q}
          index={cur}
          selected={answers[q.id]}
          onSelect={(optId) => setAnswers((a) => ({ ...a, [q.id]: optId }))}
        />

        <div className="flex justify-between">
          <button
            onClick={() => setCur((i) => Math.max(0, i - 1))}
            disabled={cur === 0}
            className="btn-secondary"
          >
            <ChevronLeft className="w-4 h-4" /> Trước
          </button>
          {cur === quiz.questions.length - 1 ? (
            <button onClick={finishTest} className="btn-primary">
              Nộp bài <Trophy className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setCur((i) => Math.min(quiz.questions.length - 1, i + 1))}
              className="btn-primary"
            >
              Tiếp <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  if (mode === "flashcard") {
    const q = quiz.questions[cur];
    const correctOpt = q.options.find((o) => o.isCorrect);
    return (
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setMode("select")}
            className="text-sm text-gray-600 hover:text-gray-900 inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> Thoát
          </button>
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-emerald-600">{cur + 1}</span> /{" "}
            {quiz.questions.length}
          </div>
        </div>

        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all"
            style={{ width: `${((cur + 1) / quiz.questions.length) * 100}%` }}
          />
        </div>

        <button
          onClick={() => setFlip(!flip)}
          className="w-full min-h-[320px] card p-10 flex items-center justify-center text-center cursor-pointer hover:shadow-md transition-shadow"
        >
          {!flip ? (
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">
                Câu hỏi
              </p>
              <p className="text-2xl font-semibold text-gray-900 leading-relaxed">
                {q.text}
              </p>
              <p className="text-xs text-gray-400 mt-6">Bấm để xem đáp án</p>
            </div>
          ) : (
            <div>
              <p className="text-xs uppercase tracking-wider text-emerald-500 mb-3">
                Đáp án
              </p>
              <p className="text-2xl font-semibold text-gray-900 leading-relaxed">
                {correctOpt?.text}
              </p>
              {q.explanation && (
                <p className="text-sm text-gray-500 mt-4 max-w-md mx-auto">
                  {q.explanation}
                </p>
              )}
            </div>
          )}
        </button>

        {flip && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 text-center font-medium">
              Bạn nhớ tốt mức nào?
            </p>
            <div className="grid grid-cols-4 gap-2">
              {(
                [
                  { id: "forgot", label: "Quên", color: "bg-rose-100 text-rose-700 hover:bg-rose-200" },
                  { id: "hard", label: "Khó", color: "bg-orange-100 text-orange-700 hover:bg-orange-200" },
                  { id: "good", label: "Tốt", color: "bg-blue-100 text-blue-700 hover:bg-blue-200" },
                  { id: "clear", label: "Rất tốt", color: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" },
                ] as { id: FlashcardRating; label: string; color: string }[]
              ).map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    setRatings({ ...ratings, [q.id]: r.id });
                    if (cur < quiz.questions.length - 1) {
                      setCur(cur + 1);
                      setFlip(false);
                    } else {
                      setMode("results");
                    }
                  }}
                  className={`py-3 rounded-lg font-medium text-sm ${r.color}`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Results
  const pct = Math.round((score / quiz.questions.length) * 100);
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="card p-8 text-center">
        <div
          className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4 ${
            pct >= 80 ? "bg-emerald-100" : pct >= 50 ? "bg-amber-100" : "bg-rose-100"
          }`}
        >
          <Trophy
            className={`w-10 h-10 ${
              pct >= 80 ? "text-emerald-600" : pct >= 50 ? "text-amber-600" : "text-rose-600"
            }`}
          />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          {pct >= 80 ? "Xuất sắc!" : pct >= 50 ? "Khá tốt!" : "Cố gắng thêm!"}
        </h2>
        <p className="text-gray-500 mt-1">
          Bạn trả lời đúng {score} trên {quiz.questions.length} câu
        </p>

        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="p-4 rounded-lg bg-gray-50">
            <p className="text-2xl font-bold text-gray-900">{pct}%</p>
            <p className="text-xs text-gray-500 mt-0.5">Điểm số</p>
          </div>
          <div className="p-4 rounded-lg bg-gray-50">
            <p className="text-2xl font-bold text-gray-900">{fmtTime(time)}</p>
            <p className="text-xs text-gray-500 mt-0.5">Thời gian</p>
          </div>
          <div className="p-4 rounded-lg bg-gray-50">
            <p className="text-2xl font-bold text-gray-900">
              {quiz.questions.length - score}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">Sai</p>
          </div>
        </div>

        <div className="flex gap-2 mt-6 justify-center">
          <button onClick={startTest} className="btn-secondary">
            <RotateCcw className="w-4 h-4" /> Làm lại
          </button>
          <Link to="/quizzes" className="btn-primary">
            Xong
          </Link>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">Chi tiết kết quả</h3>
        {quiz.questions.map((q, i) => {
          const ans = answers[q.id];
          const correct = q.options.find((o) => o.isCorrect);
          const isCorrect = ans === correct?.id;
          return (
            <div key={q.id} className="card p-4 flex items-start gap-3">
              {isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className="text-sm text-gray-500">Câu {i + 1}</p>
                <p className="font-medium text-gray-900">{q.text}</p>
                <p className="text-sm text-emerald-700 mt-1">
                  ✓ {correct?.text}
                </p>
                {!isCorrect && ans && (
                  <p className="text-sm text-rose-700">
                    ✗ Bạn chọn: {q.options.find((o) => o.id === ans)?.text}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
