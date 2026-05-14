import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Sparkles,
  Share2,
  Play,
  Brain,
  Users,
  Clock,
  TrendingUp,
} from "lucide-react";
import { mockQuizzes } from "../../data/mock";
import type { Difficulty } from "../../types";

const diffColor: Record<Difficulty, string> = {
  easy: "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-700",
  hard: "bg-rose-100 text-rose-700",
};
const diffLabel: Record<Difficulty, string> = {
  easy: "Dễ",
  medium: "Vừa",
  hard: "Khó",
};

export default function QuizListPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");

  const list = mockQuizzes.filter((q) => {
    const ok = q.title.toLowerCase().includes(search.toLowerCase());
    if (filter === "published") return ok && q.isPublished;
    if (filter === "draft") return ok && !q.isPublished;
    return ok;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bộ câu hỏi của tôi</h1>
          <p className="text-gray-500 mt-1">
            Quản lý, chỉnh sửa và chia sẻ các bộ câu hỏi.
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/generate" className="btn-secondary">
            <Sparkles className="w-4 h-4" /> Tạo bằng AI
          </Link>
          <Link to="/quizzes/new" className="btn-primary">
            <Plus className="w-4 h-4" /> Tạo thủ công
          </Link>
        </div>
      </div>

      <div className="card p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm bộ câu hỏi..."
            className="input pl-9"
          />
        </div>
        <div className="flex gap-1.5">
          {(["all", "published", "draft"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                filter === s ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {s === "all" ? "Tất cả" : s === "published" ? "Đã đăng" : "Bản nháp"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((q) => (
          <div key={q.id} className="card overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-2 bg-gradient-to-r from-indigo-500 to-violet-500" />
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <span className={`badge ${diffColor[q.difficulty]}`}>
                  {diffLabel[q.difficulty]}
                </span>
                {q.isPublished ? (
                  <span className="badge bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Đã đăng
                  </span>
                ) : (
                  <span className="badge bg-gray-100 text-gray-600">Nháp</span>
                )}
              </div>

              <Link to={`/quizzes/${q.id}`}>
                <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-indigo-600">
                  {q.title}
                </h3>
              </Link>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{q.description}</p>

              <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Brain className="w-3.5 h-3.5" /> {q.questionCount} câu
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> {q.attempts ?? 0} lượt
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> {q.avgScore ?? 0}%
                </span>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(q.createdAt).toLocaleDateString("vi-VN")}
                </span>
                <div className="flex gap-1">
                  <Link
                    to={`/practice/${q.id}`}
                    className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                    title="Luyện tập"
                  >
                    <Play className="w-4 h-4" />
                  </Link>
                  <button
                    className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                    title="Chia sẻ"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
