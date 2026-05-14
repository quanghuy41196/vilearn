import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Users, BookOpen, X } from "lucide-react";
import { mockClasses } from "../../data/mock";

export default function ClassListPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lớp học</h1>
          <p className="text-gray-500 mt-1">
            Quản lý lớp, học sinh và nhóm.
          </p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> Tạo lớp mới
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockClasses.map((c) => (
          <Link
            key={c.id}
            to={`/classes/${c.id}`}
            className="card overflow-hidden hover:shadow-md transition-shadow group"
          >
            <div className={`h-24 bg-gradient-to-br ${c.color ?? "from-indigo-500 to-violet-600"} relative`}>
              <div className="absolute inset-0 flex items-end p-4">
                <h3 className="text-white font-bold text-lg">{c.name}</h3>
              </div>
            </div>
            <div className="p-5">
              <p className="text-sm text-gray-500 line-clamp-2">{c.description}</p>
              <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" /> {c.memberCount} học sinh
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" /> {c.subject}
                </span>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500">Mã tham gia</span>
                <code className="text-sm font-mono font-semibold text-indigo-600">
                  {c.joinCode}
                </code>
              </div>
            </div>
          </Link>
        ))}

        <button
          onClick={() => setShowCreate(true)}
          className="card border-dashed border-2 border-gray-200 p-6 flex flex-col items-center justify-center text-gray-500 hover:border-indigo-300 hover:text-indigo-600 transition-colors min-h-[260px]"
        >
          <Plus className="w-8 h-8 mb-2" />
          <span className="font-medium">Tạo lớp mới</span>
        </button>
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Tạo lớp mới</h2>
              <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label">Tên lớp</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input"
                  placeholder="Ví dụ: Lịch sử 12A1"
                />
              </div>
              <div>
                <label className="label">Mô tả</label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  rows={3}
                  className="input resize-none"
                  placeholder="Mô tả mục tiêu và nội dung lớp học..."
                />
              </div>
              <div>
                <label className="label">Môn học</label>
                <select className="input">
                  <option>Lịch sử</option>
                  <option>Toán học</option>
                  <option>Vật lý</option>
                  <option>Hoá học</option>
                  <option>Tiếng Anh</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setShowCreate(false)} className="btn-secondary">
                Huỷ
              </button>
              <button onClick={() => setShowCreate(false)} className="btn-primary">
                Tạo lớp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
