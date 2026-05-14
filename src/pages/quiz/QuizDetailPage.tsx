import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Play,
  Plus,
  Share2,
  Globe,
  Lock,
  Copy,
  Check,
  Sparkles,
  Gamepad2,
  ClipboardList,
} from "lucide-react";
import { mockQuizzes } from "../../data/mock";
import QuestionEditor from "../../components/quiz/QuestionEditor";
import type { Question, Quiz } from "../../types";

export default function QuizDetailPage() {
  const { id } = useParams();
  const initial = useMemo(
    () => mockQuizzes.find((q) => q.id === id) ?? mockQuizzes[0],
    [id]
  );
  const [quiz, setQuiz] = useState<Quiz>(initial);
  const [copied, setCopied] = useState(false);

  const updateQuestion = (q: Question) => {
    setQuiz({
      ...quiz,
      questions: quiz.questions.map((x) => (x.id === q.id ? q : x)),
    });
  };

  const removeQuestion = (qid: string) => {
    setQuiz({
      ...quiz,
      questions: quiz.questions.filter((x) => x.id !== qid),
      questionCount: quiz.questions.length - 1,
    });
  };

  const move = (idx: number, dir: -1 | 1) => {
    const items = [...quiz.questions];
    const target = idx + dir;
    if (target < 0 || target >= items.length) return;
    [items[idx], items[target]] = [items[target], items[idx]];
    setQuiz({ ...quiz, questions: items });
  };

  const addQuestion = () => {
    const newQ: Question = {
      id: `q-${Date.now()}`,
      type: "multiple_choice",
      order: quiz.questions.length + 1,
      text: "",
      options: [
        { id: "o1", text: "", isCorrect: false },
        { id: "o2", text: "", isCorrect: false },
        { id: "o3", text: "", isCorrect: false },
        { id: "o4", text: "", isCorrect: false },
      ],
    };
    setQuiz({ ...quiz, questions: [...quiz.questions, newQ], questionCount: quiz.questions.length + 1 });
  };

  const copyShare = () => {
    navigator.clipboard.writeText(`https://vilearn.vn/q/${quiz.shareCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Link to="/quizzes" className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900">
        <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
      </Link>

      <div className="card p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-[280px]">
            <input
              value={quiz.title}
              onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
              className="text-2xl font-bold text-gray-900 w-full focus:outline-none border-b border-transparent focus:border-indigo-300 pb-1"
            />
            <textarea
              value={quiz.description ?? ""}
              onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
              rows={2}
              className="w-full text-sm text-gray-500 mt-2 focus:outline-none resize-none"
              placeholder="Thêm mô tả..."
            />
          </div>

          <div className="flex flex-col gap-2 items-end">
            <div className="flex gap-2">
              <Link to={`/practice/${quiz.id}`} className="btn-secondary">
                <Play className="w-4 h-4" /> Luyện tập
              </Link>
              <Link to={`/game/host?quizId=${quiz.id}`} className="btn-primary">
                <Gamepad2 className="w-4 h-4" /> Khởi động Game
              </Link>
            </div>
            <button className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
              <ClipboardList className="w-3 h-3" /> Giao bài cho lớp
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-5 pt-5 border-t border-gray-100">
          <button
            onClick={() => setQuiz({ ...quiz, isPublished: !quiz.isPublished })}
            className={`btn ${quiz.isPublished ? "btn-secondary text-emerald-700" : "btn-secondary"}`}
          >
            {quiz.isPublished ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            {quiz.isPublished ? "Đã đăng" : "Bản nháp"}
          </button>

          {quiz.isPublished && quiz.shareCode && (
            <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 rounded-lg">
              <Share2 className="w-4 h-4 text-indigo-600" />
              <code className="text-sm text-indigo-700 font-mono">
                vilearn.vn/q/{quiz.shareCode}
              </code>
              <button
                onClick={copyShare}
                className="text-indigo-600 hover:text-indigo-800"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          )}

          <div className="ml-auto flex gap-4 text-sm text-gray-500">
            <span>{quiz.questions.length} câu hỏi</span>
            <span>•</span>
            <span>Độ khó: {quiz.difficulty}</span>
            <span>•</span>
            <span>{quiz.attempts ?? 0} lượt làm</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Danh sách câu hỏi ({quiz.questions.length})
        </h2>
        <div className="flex gap-2">
          <button className="btn-secondary">
            <Sparkles className="w-4 h-4" /> Tạo thêm bằng AI
          </button>
          <button onClick={addQuestion} className="btn-primary">
            <Plus className="w-4 h-4" /> Thêm câu hỏi
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {quiz.questions.map((q, i) => (
          <QuestionEditor
            key={q.id}
            question={q}
            index={i}
            onUpdate={updateQuestion}
            onRemove={() => removeQuestion(q.id)}
            onMoveUp={i > 0 ? () => move(i, -1) : undefined}
            onMoveDown={i < quiz.questions.length - 1 ? () => move(i, 1) : undefined}
          />
        ))}
      </div>
    </div>
  );
}
