import { useState } from "react";
import { Calendar, Flame, Brain, Target, ChevronLeft, ChevronRight, Sparkles, RotateCw } from "lucide-react";
import { mockFlashcards, mockReviewStats } from "../../data/mock";
import type { FlashcardRating } from "../../types";

export default function ReviewPage() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [flip, setFlip] = useState(false);
  const [completed, setCompleted] = useState<string[]>([]);

  const card = mockFlashcards[activeIdx];
  const today = new Date();
  const days = Array.from({ length: 28 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - 27 + i);
    return d;
  });

  const onRate = (_r: FlashcardRating) => {
    setCompleted([...completed, card.id]);
    if (activeIdx < mockFlashcards.length - 1) {
      setActiveIdx(activeIdx + 1);
      setFlip(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ôn tập hôm nay</h1>
        <p className="text-gray-500 mt-1">
          Hệ thống ngắt quãng (spaced repetition) gợi ý các thẻ cần ôn ngay bây giờ.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile icon={Flame} label="Chuỗi học" value={`${mockReviewStats.streak} ngày`} color="from-orange-500 to-rose-500" />
        <StatTile icon={Brain} label="Cần ôn hôm nay" value={mockReviewStats.dueToday} color="from-indigo-500 to-violet-600" />
        <StatTile icon={Target} label="Tỉ lệ ghi nhớ" value={`${mockReviewStats.retention}%`} color="from-emerald-500 to-teal-600" />
        <StatTile icon={Calendar} label="Đã ôn tuần này" value={mockReviewStats.reviewed} color="from-blue-500 to-cyan-600" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Thẻ cần ôn</h2>
              <div className="text-sm text-gray-500">
                {completed.length} / {mockFlashcards.length} hoàn tất
              </div>
            </div>

            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-5">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all"
                style={{ width: `${(completed.length / mockFlashcards.length) * 100}%` }}
              />
            </div>

            <button
              onClick={() => setFlip(!flip)}
              className="w-full min-h-[260px] rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 border-2 border-indigo-200 p-8 flex items-center justify-center text-center transition-all hover:shadow-md"
            >
              {!flip ? (
                <div>
                  <p className="text-xs uppercase tracking-wider text-indigo-500 mb-2">Mặt trước</p>
                  <p className="text-xl font-semibold text-gray-900">{card.front}</p>
                  <p className="text-xs text-gray-400 mt-4">Bấm để lật thẻ</p>
                </div>
              ) : (
                <div>
                  <p className="text-xs uppercase tracking-wider text-emerald-500 mb-2">Mặt sau</p>
                  <p className="text-xl font-semibold text-gray-900">{card.back}</p>
                </div>
              )}
            </button>

            {flip && (
              <div className="mt-4 grid grid-cols-4 gap-2">
                {(
                  [
                    { id: "forgot", label: "Quên 🤔", color: "bg-rose-100 text-rose-700 hover:bg-rose-200", days: "1 phút" },
                    { id: "hard", label: "Khó 😅", color: "bg-orange-100 text-orange-700 hover:bg-orange-200", days: "10 phút" },
                    { id: "good", label: "Tốt 🙂", color: "bg-blue-100 text-blue-700 hover:bg-blue-200", days: "1 ngày" },
                    { id: "clear", label: "Dễ 😎", color: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200", days: "4 ngày" },
                  ] as { id: FlashcardRating; label: string; color: string; days: string }[]
                ).map((r) => (
                  <button
                    key={r.id}
                    onClick={() => onRate(r.id)}
                    className={`py-3 rounded-lg font-medium text-sm flex flex-col ${r.color}`}
                  >
                    <span>{r.label}</span>
                    <span className="text-[10px] opacity-70 mt-0.5">{r.days}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="flex justify-between mt-5">
              <button
                onClick={() => {
                  setActiveIdx(Math.max(0, activeIdx - 1));
                  setFlip(false);
                }}
                disabled={activeIdx === 0}
                className="btn-ghost"
              >
                <ChevronLeft className="w-4 h-4" /> Trước
              </button>
              <button
                onClick={() => {
                  setFlip(false);
                  setActiveIdx((i) => (i + 1) % mockFlashcards.length);
                }}
                className="btn-ghost"
              >
                <RotateCw className="w-4 h-4" /> Bỏ qua
              </button>
              <button
                onClick={() => {
                  setActiveIdx(Math.min(mockFlashcards.length - 1, activeIdx + 1));
                  setFlip(false);
                }}
                disabled={activeIdx === mockFlashcards.length - 1}
                className="btn-ghost"
              >
                Sau <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" /> Hoạt động 28 ngày
            </h3>
            <div className="grid grid-cols-7 gap-1.5">
              {days.map((d, i) => {
                const intensity = Math.floor(Math.random() * 5);
                const isToday = d.toDateString() === today.toDateString();
                return (
                  <div
                    key={i}
                    title={d.toLocaleDateString("vi-VN")}
                    className={`aspect-square rounded ${
                      isToday ? "ring-2 ring-indigo-500" : ""
                    } ${
                      intensity === 0
                        ? "bg-gray-100"
                        : intensity === 1
                          ? "bg-indigo-100"
                          : intensity === 2
                            ? "bg-indigo-300"
                            : intensity === 3
                              ? "bg-indigo-500"
                              : "bg-indigo-700"
                    }`}
                  />
                );
              })}
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-500">
              <span>Ít</span>
              <div className="w-2.5 h-2.5 bg-gray-100 rounded" />
              <div className="w-2.5 h-2.5 bg-indigo-100 rounded" />
              <div className="w-2.5 h-2.5 bg-indigo-300 rounded" />
              <div className="w-2.5 h-2.5 bg-indigo-500 rounded" />
              <div className="w-2.5 h-2.5 bg-indigo-700 rounded" />
              <span>Nhiều</span>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Tiến độ theo môn</h3>
            <div className="space-y-3">
              {mockReviewStats.bySubject.map((s) => {
                const pct = Math.round((s.mastered / s.total) * 100);
                return (
                  <div key={s.subject}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">{s.subject}</span>
                      <span className="text-gray-500">{pct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card p-5 bg-gradient-to-br from-indigo-50 to-violet-50 border-indigo-100">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-indigo-900 text-sm">Gợi ý hôm nay</p>
                <p className="text-xs text-indigo-700 mt-1">
                  Bạn đang ôn Toán học chậm hơn lịch dự kiến. Hãy dành 10 phút để bắt kịp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="card p-4 relative overflow-hidden">
      <div className={`absolute -right-4 -top-4 w-16 h-16 rounded-full bg-gradient-to-br ${color} opacity-15`} />
      <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
        <Icon className="w-4.5 h-4.5 text-white" />
      </div>
      <p className="text-2xl font-bold text-gray-900 mt-3">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}
