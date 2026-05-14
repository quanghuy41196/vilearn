import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Loader2,
  Check,
  ChevronRight,
  FileText,
  Globe,
  Youtube,
} from "lucide-react";
import { mockContents } from "../../data/mock";
import type { Difficulty, QuestionType } from "../../types";

const sourceIcon = { file: FileText, url: Globe, youtube: Youtube };

export default function GeneratePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [contentId, setContentId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [count, setCount] = useState(10);
  const [types, setTypes] = useState<QuestionType[]>(["multiple_choice"]);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const completedContents = mockContents.filter((c) => c.status === "completed");

  const toggleType = (t: QuestionType) => {
    setTypes((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]));
  };

  const startGenerate = () => {
    setStep(3);
    setProgress(0);
    setLogs([]);
    const messages = [
      "Đang đọc tài liệu...",
      "Trích xuất các khái niệm chính...",
      "Phân tích cấu trúc kiến thức...",
      `Tạo ${count} câu hỏi ở độ khó ${difficulty}...`,
      "Soạn giải thích cho mỗi đáp án...",
      "Hoàn thiện bộ câu hỏi...",
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < messages.length) {
        setLogs((l) => [...l, messages[i]]);
        setProgress(Math.round(((i + 1) / messages.length) * 100));
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => navigate("/quizzes/qz-001"), 800);
      }
    }, 900);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-violet-600" /> Tạo bộ câu hỏi bằng AI
        </h1>
        <p className="text-gray-500 mt-1">
          Chọn tư liệu nguồn và để AI sinh câu hỏi chất lượng cao trong vài giây.
        </p>
      </div>

      <div className="flex items-center gap-2 text-sm">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center font-semibold ${
                step >= s ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-500"
              }`}
            >
              {step > s ? <Check className="w-4 h-4" /> : s}
            </div>
            <span className={step >= s ? "text-gray-900 font-medium" : "text-gray-500"}>
              {s === 1 ? "Chọn tư liệu" : s === 2 ? "Cấu hình" : "Tạo câu hỏi"}
            </span>
            {s < 3 && <div className="flex-1 h-0.5 bg-gray-200 mx-1" />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Chọn tư liệu nguồn</h2>
          <p className="text-sm text-gray-500 mb-4">
            Chỉ những tư liệu đã được xử lý xong mới có thể tạo câu hỏi.
          </p>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {completedContents.map((c) => {
              const Icon = sourceIcon[c.source];
              return (
                <label
                  key={c.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                    contentId === c.id
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="content"
                    checked={contentId === c.id}
                    onChange={() => setContentId(c.id)}
                    className="text-indigo-600"
                  />
                  <div className="w-9 h-9 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{c.title}</p>
                    <p className="text-xs text-gray-500">{c.description}</p>
                  </div>
                </label>
              );
            })}
          </div>
          <div className="mt-5 flex justify-end">
            <button
              onClick={() => setStep(2)}
              disabled={!contentId}
              className="btn-primary"
            >
              Tiếp tục <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="card p-6 space-y-5">
          <h2 className="text-lg font-semibold text-gray-900">Cấu hình bộ câu hỏi</h2>

          <div>
            <label className="label">Tiêu đề</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Ôn tập chương 4 — Lịch sử 12"
              className="input"
            />
          </div>

          <div>
            <label className="label">Độ khó</label>
            <div className="grid grid-cols-3 gap-2">
              {(["easy", "medium", "hard"] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`p-3 rounded-lg border-2 text-sm font-medium ${
                    difficulty === d
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {d === "easy" ? "🌱 Dễ" : d === "medium" ? "⚡ Vừa" : "🔥 Khó"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Số câu hỏi: {count}</label>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>5</span><span>15</span><span>25</span><span>35</span><span>50</span>
            </div>
          </div>

          <div>
            <label className="label">Loại câu hỏi</label>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { id: "multiple_choice", label: "Trắc nghiệm" },
                  { id: "true_false", label: "Đúng / Sai" },
                  { id: "fill_blank", label: "Điền khuyết" },
                  { id: "short_answer", label: "Tự luận ngắn" },
                ] as { id: QuestionType; label: string }[]
              ).map((t) => (
                <label
                  key={t.id}
                  className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer ${
                    types.includes(t.id)
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={types.includes(t.id)}
                    onChange={() => toggleType(t.id)}
                    className="text-indigo-600 rounded"
                  />
                  <span className="text-sm font-medium">{t.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <button onClick={() => setStep(1)} className="btn-secondary">
              Quay lại
            </button>
            <button
              onClick={startGenerate}
              disabled={types.length === 0}
              className="btn-primary"
            >
              <Sparkles className="w-4 h-4" /> Bắt đầu tạo
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="card p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">AI đang làm việc...</h3>
          <p className="text-gray-500 mt-1">Thời gian ước tính: 10-20 giây</p>

          <div className="mt-6">
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">{progress}%</p>
          </div>

          <div className="mt-6 text-left bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
            {logs.map((log, i) => (
              <div key={i} className="text-sm text-gray-700 flex items-center gap-2 mb-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span>{log}</span>
              </div>
            ))}
            {logs.length === 0 && (
              <p className="text-sm text-gray-400">Đang khởi tạo...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
