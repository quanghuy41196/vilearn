import { Link } from "react-router-dom";
import {
  BookOpen,
  Brain,
  Users,
  Flame,
  TrendingUp,
  Upload,
  Sparkles,
  Gamepad2,
  ArrowRight,
  Clock,
} from "lucide-react";
import { mockClasses, mockQuizzes, mockReviewStats } from "../../data/mock";
import { useAuth } from "../../hooks/useAuth";

function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  trend?: string;
  color: string;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> {trend}
            </p>
          )}
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();

  const actions = [
    { to: "/upload", icon: Upload, label: "Tải tư liệu", color: "from-blue-500 to-blue-600" },
    { to: "/generate", icon: Sparkles, label: "Tạo Quiz AI", color: "from-violet-500 to-fuchsia-600" },
    { to: "/review", icon: Brain, label: "Ôn tập hôm nay", color: "from-emerald-500 to-teal-600" },
    { to: "/game/host", icon: Gamepad2, label: "Tổ chức game", color: "from-orange-500 to-rose-600" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Xin chào, {user?.firstName ?? "bạn"} 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Bạn có <span className="font-semibold text-indigo-600">{mockReviewStats.dueToday} thẻ</span> cần ôn tập hôm nay.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Flame} label="Chuỗi học" value={`${mockReviewStats.streak} ngày`} trend="+1 hôm nay" color="bg-orange-500" />
        <StatCard icon={Brain} label="Đã ôn tập" value={mockReviewStats.reviewed} trend="Tuần này" color="bg-indigo-600" />
        <StatCard icon={BookOpen} label="Bộ câu hỏi" value={mockQuizzes.length} color="bg-emerald-600" />
        <StatCard icon={Users} label="Lớp đang dạy" value={mockClasses.length} color="bg-rose-500" />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Hành động nhanh</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {actions.map((a) => (
            <Link
              key={a.to}
              to={a.to}
              className={`bg-gradient-to-br ${a.color} text-white rounded-xl p-4 hover:shadow-lg transition-shadow group`}
            >
              <a.icon className="w-6 h-6 mb-3" />
              <p className="font-semibold text-sm">{a.label}</p>
              <ArrowRight className="w-4 h-4 mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Bộ câu hỏi gần đây</h2>
            <Link to="/quizzes" className="text-sm text-indigo-600 hover:underline">
              Xem tất cả
            </Link>
          </div>
          <div className="space-y-3">
            {mockQuizzes.slice(0, 3).map((q) => (
              <Link
                key={q.id}
                to={`/quizzes/${q.id}`}
                className="card p-4 hover:shadow-md transition-shadow flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center text-2xl">
                  📚
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{q.title}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span className="chip">{q.subject}</span>
                    <span>{q.questionCount} câu</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {new Date(q.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Tiến độ theo môn</h2>
          <div className="card p-5 space-y-4">
            {mockReviewStats.bySubject.map((s) => {
              const pct = Math.round((s.mastered / s.total) * 100);
              return (
                <div key={s.subject}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-gray-700">{s.subject}</span>
                    <span className="text-gray-500">
                      {s.mastered}/{s.total}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
