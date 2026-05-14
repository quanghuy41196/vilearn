import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Upload,
  Brain,
  ClipboardList,
  Users,
  Calendar,
  Gamepad2,
  GraduationCap,
  Sparkles,
} from "lucide-react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Tổng quan" },
  { to: "/contents", icon: BookOpen, label: "Tư liệu" },
  { to: "/upload", icon: Upload, label: "Tải lên" },
  { to: "/quizzes", icon: Brain, label: "Bộ câu hỏi" },
  { to: "/generate", icon: Sparkles, label: "Tạo Quiz AI" },
  { to: "/review", icon: Calendar, label: "Ôn tập" },
  { to: "/classes", icon: Users, label: "Lớp học" },
  { to: "/assignments", icon: ClipboardList, label: "Bài tập" },
  { to: "/game/host", icon: Gamepad2, label: "Game Show" },
];

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-gray-200 sticky top-0 h-screen">
      <div className="px-6 py-5 border-b border-gray-100">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-soft">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-none">ViLearn</h1>
            <p className="text-[11px] text-gray-500 mt-0.5">Học thông minh hơn</p>
          </div>
        </NavLink>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`
            }
          >
            <Icon className="w-[18px] h-[18px]" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-gray-100">
        <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl p-4">
          <p className="text-xs font-semibold text-indigo-900">Nâng cấp Pro</p>
          <p className="text-[11px] text-indigo-700 mt-0.5 leading-relaxed">
            Không giới hạn lượt tạo AI, lớp học và game show.
          </p>
          <button className="mt-2.5 w-full bg-indigo-600 text-white text-xs font-semibold py-1.5 rounded-lg hover:bg-indigo-700">
            Nâng cấp ngay
          </button>
        </div>
      </div>
    </aside>
  );
}
