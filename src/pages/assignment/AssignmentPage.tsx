import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Calendar,
  Users,
  Eye,
  X,
  CheckCircle2,
} from "lucide-react";
import {
  mockAssignments,
  mockClasses,
  mockQuizzes,
  mockSubmissions,
} from "../../data/mock";

export default function AssignmentPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [active, setActive] = useState(mockAssignments[0]?.id ?? "");

  const submissions = mockSubmissions.filter((s) => s.assignmentId === active);
  const assignment = mockAssignments.find((a) => a.id === active);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bài tập</h1>
          <p className="text-gray-500 mt-1">Theo dõi tiến độ làm bài của học sinh.</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> Giao bài mới
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="space-y-3">
          {mockAssignments.map((a) => {
            const pct = Math.round((a.submissionCount / a.totalStudents) * 100);
            return (
              <button
                key={a.id}
                onClick={() => setActive(a.id)}
                className={`w-full text-left card p-4 transition-all ${
                  active === a.id ? "ring-2 ring-indigo-500" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="font-medium text-sm line-clamp-2">{a.title}</p>
                  <span
                    className={`badge flex-shrink-0 ${
                      a.status === "published"
                        ? "bg-emerald-100 text-emerald-700"
                        : a.status === "draft"
                          ? "bg-gray-100 text-gray-600"
                          : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {a.status === "published" ? "Mở" : a.status === "draft" ? "Nháp" : "Đóng"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  Hạn: {new Date(a.dueDate).toLocaleDateString("vi-VN")}
                </p>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>{a.submissionCount}/{a.totalStudents}</span>
                  <span>{pct}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-2 space-y-4">
          {assignment && (
            <>
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900">{assignment.title}</h2>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    Hạn: {new Date(assignment.dueDate).toLocaleString("vi-VN")}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    {assignment.submissionCount}/{assignment.totalStudents} đã nộp
                  </span>
                  <Link
                    to={`/assignments/take/${assignment.id}`}
                    className="text-indigo-600 hover:underline text-sm font-medium"
                  >
                    Xem dưới dạng học sinh →
                  </Link>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-5">
                  <div className="p-3 rounded-lg bg-emerald-50">
                    <p className="text-xs text-emerald-700">Điểm trung bình</p>
                    <p className="text-xl font-bold text-emerald-900 mt-1">8.5</p>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-50">
                    <p className="text-xs text-blue-700">Thời gian TB</p>
                    <p className="text-xl font-bold text-blue-900 mt-1">14p</p>
                  </div>
                  <div className="p-3 rounded-lg bg-violet-50">
                    <p className="text-xs text-violet-700">Tỉ lệ hoàn thành</p>
                    <p className="text-xl font-bold text-violet-900 mt-1">
                      {Math.round((assignment.submissionCount / assignment.totalStudents) * 100)}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="card overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Danh sách nộp bài</h3>
                  <span className="text-sm text-gray-500">{submissions.length} bài</span>
                </div>
                <div className="divide-y divide-gray-100">
                  {submissions.map((s) => {
                    const pct = Math.round((s.score / s.total) * 100);
                    return (
                      <div key={s.id} className="px-5 py-3 flex items-center gap-3 hover:bg-gray-50">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center text-sm font-semibold">
                          {s.studentName.split(" ").pop()?.[0]}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{s.studentName}</p>
                          <p className="text-xs text-gray-500">
                            Nộp {new Date(s.submittedAt).toLocaleString("vi-VN")} • {s.duration} phút
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-bold ${
                              pct >= 80 ? "text-emerald-600" : pct >= 50 ? "text-amber-600" : "text-rose-600"
                            }`}
                          >
                            {s.score}/{s.total}
                          </p>
                          <p className="text-xs text-gray-500">{pct}%</p>
                        </div>
                        <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                  {submissions.length === 0 && (
                    <div className="px-5 py-10 text-center text-gray-400 text-sm">
                      Chưa có bài nộp nào.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Giao bài tập mới</h2>
              <button onClick={() => setShowCreate(false)} className="text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="label">Tiêu đề</label>
                <input className="input" placeholder="Bài kiểm tra tuần 4" />
              </div>
              <div>
                <label className="label">Bộ câu hỏi</label>
                <select className="input">
                  {mockQuizzes.map((q) => (
                    <option key={q.id}>{q.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Lớp</label>
                <select className="input">
                  {mockClasses.map((c) => (
                    <option key={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Hạn nộp</label>
                <input type="datetime-local" className="input" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setShowCreate(false)} className="btn-secondary">Huỷ</button>
              <button onClick={() => setShowCreate(false)} className="btn-primary">
                <CheckCircle2 className="w-4 h-4" /> Giao bài
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
