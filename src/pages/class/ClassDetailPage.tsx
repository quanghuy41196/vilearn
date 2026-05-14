import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Copy,
  Check,
  Plus,
  Users,
  ClipboardList,
  Settings,
  MoreVertical,
  RefreshCw,
} from "lucide-react";
import {
  mockAssignments,
  mockClassMembers,
  mockClasses,
  mockGroups,
} from "../../data/mock";

type Tab = "members" | "groups" | "assignments" | "settings";

export default function ClassDetailPage() {
  const { id } = useParams();
  const cls = useMemo(
    () => mockClasses.find((c) => c.id === id) ?? mockClasses[0],
    [id]
  );

  const [tab, setTab] = useState<Tab>("members");
  const [copied, setCopied] = useState(false);
  const [showGroup, setShowGroup] = useState(false);
  const [groupName, setGroupName] = useState("");

  const copyCode = () => {
    navigator.clipboard.writeText(cls.joinCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const classAssignments = mockAssignments.filter((a) => a.classId === cls.id);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <Link to="/classes" className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900">
        <ArrowLeft className="w-4 h-4" /> Quay lại danh sách lớp
      </Link>

      <div className="card overflow-hidden">
        <div className={`h-32 bg-gradient-to-br ${cls.color ?? "from-indigo-500 to-violet-600"} relative`}>
          <div className="absolute inset-0 p-6 flex flex-col justify-end">
            <p className="text-white/80 text-sm">{cls.subject}</p>
            <h1 className="text-white text-3xl font-bold">{cls.name}</h1>
          </div>
        </div>
        <div className="p-6 flex flex-wrap items-center gap-4">
          <p className="text-gray-600 flex-1 min-w-[240px]">{cls.description}</p>

          <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 rounded-lg">
            <span className="text-xs text-indigo-700 font-medium">Mã tham gia</span>
            <code className="font-mono font-bold text-indigo-700">{cls.joinCode}</code>
            <button onClick={copyCode} className="text-indigo-600 hover:text-indigo-800">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
            <button className="text-indigo-600 hover:text-indigo-800" title="Đổi mã">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {(
            [
              { id: "members", label: "Thành viên", icon: Users, count: cls.memberCount },
              { id: "groups", label: "Nhóm", icon: Users, count: mockGroups.length },
              { id: "assignments", label: "Bài tập", icon: ClipboardList, count: classAssignments.length },
              { id: "settings", label: "Cài đặt", icon: Settings },
            ] as { id: Tab; label: string; icon: React.ElementType; count?: number }[]
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px flex items-center gap-2 whitespace-nowrap ${
                tab === t.id
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
              {t.count !== undefined && (
                <span className="badge bg-gray-100 text-gray-600 ml-1">{t.count}</span>
              )}
            </button>
          ))}
        </div>

        <div className="p-6">
          {tab === "members" && <MembersTab />}
          {tab === "groups" && (
            <GroupsTab
              onCreate={() => setShowGroup(true)}
            />
          )}
          {tab === "assignments" && <AssignmentsTab assignments={classAssignments} />}
          {tab === "settings" && <SettingsTab cls={cls} />}
        </div>
      </div>

      {showGroup && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-slide-up">
            <h2 className="text-lg font-semibold mb-4">Tạo nhóm mới</h2>
            <div>
              <label className="label">Tên nhóm</label>
              <input
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="input"
                placeholder="Ví dụ: Nhóm Sao Đỏ"
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowGroup(false)} className="btn-secondary">
                Huỷ
              </button>
              <button onClick={() => setShowGroup(false)} className="btn-primary">
                Tạo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MembersTab() {
  return (
    <div className="space-y-2">
      {mockClassMembers.map((m) => (
        <div key={m.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
          <img src={m.avatar} alt={m.name} className="w-9 h-9 rounded-full bg-gray-200" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">{m.name}</p>
            <p className="text-xs text-gray-500">{m.email}</p>
          </div>
          <span className="chip">{m.role === "student" ? "Học sinh" : "Giáo viên"}</span>
          <button className="text-gray-400 hover:text-gray-600 p-1">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

function GroupsTab({ onCreate }: { onCreate: () => void }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">Chia học sinh thành các nhóm để thi đấu hoặc bài tập nhóm.</p>
        <button onClick={onCreate} className="btn-primary">
          <Plus className="w-4 h-4" /> Tạo nhóm
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {mockGroups.map((g) => {
          const members = mockClassMembers.filter((m) => g.memberIds.includes(m.id));
          return (
            <div key={g.id} className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">{g.name}</h3>
                <span className="badge bg-indigo-50 text-indigo-700">
                  {members.length} thành viên
                </span>
              </div>
              <div className="flex -space-x-2">
                {members.map((m) => (
                  <img
                    key={m.id}
                    src={m.avatar}
                    alt={m.name}
                    className="w-8 h-8 rounded-full bg-gray-200 ring-2 ring-white"
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AssignmentsTab({ assignments }: { assignments: typeof mockAssignments }) {
  return (
    <div className="space-y-3">
      <Link to="/assignments" className="btn-primary inline-flex">
        <Plus className="w-4 h-4" /> Giao bài tập mới
      </Link>
      {assignments.map((a) => (
        <div key={a.id} className="card p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">{a.title}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Hạn: {new Date(a.dueDate).toLocaleString("vi-VN")}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold">
              {a.submissionCount}/{a.totalStudents}
            </p>
            <p className="text-xs text-gray-500">đã nộp</p>
          </div>
          <span
            className={`badge ${
              a.status === "published"
                ? "bg-emerald-100 text-emerald-700"
                : a.status === "draft"
                  ? "bg-gray-100 text-gray-600"
                  : "bg-rose-100 text-rose-700"
            }`}
          >
            {a.status === "published" ? "Đang mở" : a.status === "draft" ? "Nháp" : "Đã đóng"}
          </span>
        </div>
      ))}
    </div>
  );
}

function SettingsTab({ cls }: { cls: (typeof mockClasses)[number] }) {
  return (
    <div className="space-y-5 max-w-md">
      <div>
        <label className="label">Tên lớp</label>
        <input defaultValue={cls.name} className="input" />
      </div>
      <div>
        <label className="label">Mô tả</label>
        <textarea defaultValue={cls.description} rows={3} className="input resize-none" />
      </div>
      <div className="flex items-center justify-between p-3 rounded-lg bg-rose-50 border border-rose-200">
        <div>
          <p className="font-medium text-rose-900 text-sm">Xoá lớp này</p>
          <p className="text-xs text-rose-700 mt-0.5">
            Mọi dữ liệu liên quan sẽ bị xoá vĩnh viễn.
          </p>
        </div>
        <button className="btn-danger">Xoá lớp</button>
      </div>
    </div>
  );
}
