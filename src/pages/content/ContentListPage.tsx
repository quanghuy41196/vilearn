import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Globe,
  Youtube,
  Search,
  Plus,
  Sparkles,
  Check,
  X,
  Loader2,
  Clock,
  MoreVertical,
} from "lucide-react";
import { mockContents } from "../../data/mock";
import type { Content, ContentStatus } from "../../types";

const statusBadge: Record<ContentStatus, { text: string; cls: string; icon: React.ElementType }> = {
  pending: { text: "Chờ xử lý", cls: "bg-amber-100 text-amber-800", icon: Clock },
  processing: { text: "Đang xử lý", cls: "bg-blue-100 text-blue-800", icon: Loader2 },
  completed: { text: "Hoàn tất", cls: "bg-emerald-100 text-emerald-800", icon: Check },
  failed: { text: "Thất bại", cls: "bg-rose-100 text-rose-800", icon: X },
};

const sourceIcon = {
  file: FileText,
  url: Globe,
  youtube: Youtube,
};

export default function ContentListPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | ContentStatus>("all");

  const filtered = mockContents.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || c.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Thư viện tư liệu</h1>
          <p className="text-gray-500 mt-1">
            Tất cả tài liệu, URL và video bạn đã tải lên để học máy phân tích.
          </p>
        </div>
        <Link to="/upload" className="btn-primary">
          <Plus className="w-4 h-4" /> Thêm tư liệu
        </Link>
      </div>

      <div className="card p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm tư liệu..."
            className="input pl-9"
          />
        </div>
        <div className="flex gap-1.5">
          {(["all", "completed", "processing", "pending", "failed"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                filter === s ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {s === "all" ? "Tất cả" : statusBadge[s].text}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c) => (
          <ContentCard key={c.id} content={c} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16 text-gray-400">
            Không tìm thấy tư liệu phù hợp.
          </div>
        )}
      </div>
    </div>
  );
}

function ContentCard({ content }: { content: Content }) {
  const Icon = sourceIcon[content.source];
  const status = statusBadge[content.status];
  const StatusIcon = status.icon;

  return (
    <div className="card p-4 hover:shadow-md transition-shadow flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <Icon className="w-5 h-5" />
        </div>
        <button className="text-gray-400 hover:text-gray-600 p-1">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      <h3 className="font-semibold text-gray-900 line-clamp-2">{content.title}</h3>
      {content.description && (
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{content.description}</p>
      )}

      <div className="flex items-center gap-2 mt-3">
        <span className={`badge gap-1 ${status.cls}`}>
          <StatusIcon className={`w-3 h-3 ${content.status === "processing" ? "animate-spin" : ""}`} />
          {status.text}
        </span>
        {content.size && <span className="text-xs text-gray-500">{content.size}</span>}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {new Date(content.createdAt).toLocaleDateString("vi-VN")}
        </span>
        {content.status === "completed" && (
          <Link
            to={`/generate?contentId=${content.id}`}
            className="text-xs text-indigo-600 font-medium hover:underline flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" /> Tạo Quiz
          </Link>
        )}
      </div>
    </div>
  );
}
