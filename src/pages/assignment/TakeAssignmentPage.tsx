import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  ChevronLeft,
  ChevronRight,
  Send,
  Trophy,
  AlertTriangle,
} from "lucide-react";
import { mockAssignments, mockQuizzes } from "../../data/mock";
import QuestionCard from "../../components/quiz/QuestionCard";

type Stage = "intro" | "doing" | "submitted";

export default function TakeAssignmentPage() {
  const { id } = useParams();
  const assignment = useMemo(
    () => mockAssignments.find((a) => a.id === id) ?? mockAssignments[0],
    [id]
  );
  const quiz = useMemo(
    () => mockQuizzes.find((q) => q.id === assignment.quizId) ?? mockQuizzes[0],
    [assignment]
  );

  const [stage, setStage] = useState<Stage>("intro");
  const [cur, setCur] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  useEffect(() => {
    if (stage !== "doing") return;
    const t = setInterval(() => setTimeLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [stage]);

  useEffect(() => {
    if (timeLeft === 0 && stage === "doing") setStage("submitted");
  }, [timeLeft, stage]);

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const score = quiz.questions.reduce((acc, q) => {
    const ans = answers[q.id];
    const correctOpt = q.options.find((o) => o.isCorrect);
    return acc + (ans === correctOpt?.id ? 1 : 0);
  }, 0);

  if (stage === "intro") {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Link to="/assignments" className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4" /> Quay lại
        </Link>

        <div className="card p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-indigo-100 mx-auto flex items-center justify-center mb-4">
            <Trophy className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{assignment.title}</h1>
          <p className="text-gray-500 mt-2">{quiz.description}</p>

          <div className="grid grid-cols-3 gap-3 mt-6 text-left">
            <div className="p-3 rounded-lg bg-gray-50">
              <p className="text-xs text-gray-500">Số câu hỏi</p>
              <p className="text-lg font-bold text-gray-900">{quiz.questions.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-gray-50">
              <p className="text-xs text-gray-500">Thời gian</p>
              <p className="text-lg font-bold text-gray-900">15 phút</p>
            </div>
            <div className="p-3 rounded-lg bg-gray-50">
              <p className="text-xs text-gray-500">Hạn nộp</p>
              <p className="text-sm font-bold text-gray-900">
                {new Date(assignment.dueDate).toLocaleDateString("vi-VN")}
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-lg bg-amber-50 border border-amber-200 text-left text-sm text-amber-900 flex gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Lưu ý trước khi làm bài</p>
              <ul className="list-disc list-inside text-xs text-amber-800 mt-1 space-y-0.5">
                <li>Đảm bảo kết nối Internet ổn định</li>
                <li>Không được mở tab khác</li>
                <li>Bài làm sẽ tự nộp khi hết giờ</li>
              </ul>
            </div>
          </div>

          <button onClick={() => setStage("doing")} className="btn-primary w-full mt-6 py-3">
            Bắt đầu làm bài
          </button>
        </div>
      </div>
    );
  }

  if (stage === "doing") {
    const q = quiz.questions[cur];
    return (
      <div className="max-w-3xl mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{assignment.title}</p>
            <p className="font-semibold text-gray-900">
              Câu {cur + 1} / {quiz.questions.length}
            </p>
          </div>
          <div
            className={`badge gap-1 text-base px-3 py-1.5 ${
              timeLeft < 60 ? "bg-rose-100 text-rose-700 animate-pulse" : "bg-indigo-100 text-indigo-700"
            }`}
          >
            <Clock className="w-4 h-4" /> {fmt(timeLeft)}
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

        <div className="grid grid-cols-10 gap-1.5">
          {quiz.questions.map((qq, i) => (
            <button
              key={qq.id}
              onClick={() => setCur(i)}
              className={`aspect-square rounded text-xs font-semibold ${
                i === cur
                  ? "bg-indigo-600 text-white"
                  : answers[qq.id]
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-gray-100 text-gray-500"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setCur((i) => Math.max(0, i - 1))}
            disabled={cur === 0}
            className="btn-secondary"
          >
            <ChevronLeft className="w-4 h-4" /> Trước
          </button>
          {cur === quiz.questions.length - 1 ? (
            <button onClick={() => setStage("submitted")} className="btn-primary">
              <Send className="w-4 h-4" /> Nộp bài
            </button>
          ) : (
            <button onClick={() => setCur((i) => i + 1)} className="btn-primary">
              Tiếp <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  const pct = Math.round((score / quiz.questions.length) * 100);
  return (
    <div className="max-w-xl mx-auto">
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
        <h2 className="text-2xl font-bold text-gray-900">Đã nộp bài thành công</h2>
        <p className="text-gray-500 mt-1">Chờ giáo viên chấm để xem điểm cuối.</p>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Số câu đúng (tham khảo)</p>
          <p className="text-4xl font-bold text-gray-900 mt-1">
            {score}/{quiz.questions.length}
          </p>
        </div>

        <Link to="/assignments" className="btn-primary mt-6 w-full">
          Về danh sách bài tập
        </Link>
      </div>
    </div>
  );
}
