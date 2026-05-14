import { Bell, Search, ChevronDown } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const initials = user?.firstName
    ? `${user.firstName[0]}${user.lastName?.[0] ?? ""}`
    : user?.email?.[0]?.toUpperCase() ?? "U";

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="px-6 h-16 flex items-center gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-100 border-0 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              placeholder="Tìm kiếm bộ câu hỏi, tư liệu, lớp học..."
            />
          </div>
        </div>

        <button className="relative p-2 rounded-lg hover:bg-gray-100">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-semibold text-sm">
              {initials}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-900 leading-none">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {user?.role === "teacher" ? "Giáo viên" : "Học sinh"}
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 animate-fade-in">
              <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">
                Hồ sơ
              </button>
              <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">
                Cài đặt
              </button>
              <hr className="my-1 border-gray-100" />
              <button
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
