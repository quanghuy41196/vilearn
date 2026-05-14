import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  FileText,
  Globe,
  Youtube,
  Loader2,
  Check,
  CloudUpload,
} from "lucide-react";

type Tab = "file" | "url" | "youtube";
type Stage = "idle" | "uploading" | "processing" | "completed";

export default function UploadPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("file");
  const [stage, setStage] = useState<Stage>("idle");
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState("");
  const [fileName, setFileName] = useState("");

  const startUpload = () => {
    setStage("uploading");
    setProgress(0);
    const i1 = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(i1);
          setStage("processing");
          setTimeout(() => {
            setStage("completed");
            setTimeout(() => navigate("/contents"), 1200);
          }, 1800);
          return 100;
        }
        return p + 8;
      });
    }, 120);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      startUpload();
    }
  };

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "file", label: "Tệp tin", icon: FileText },
    { id: "url", label: "URL trang web", icon: Globe },
    { id: "youtube", label: "Video YouTube", icon: Youtube },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Thêm tư liệu mới</h1>
        <p className="text-gray-500 mt-1">
          Tải tài liệu để AI phân tích và tạo bộ câu hỏi tự động.
        </p>
      </div>

      <div className="card overflow-hidden">
        <div className="flex border-b border-gray-200">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setTab(t.id);
                setStage("idle");
                setProgress(0);
                setFileName("");
                setUrl("");
              }}
              className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 -mb-px flex items-center justify-center gap-2 ${
                tab === t.id
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {stage === "idle" && tab === "file" && (
            <label className="block border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-colors">
              <CloudUpload className="w-12 h-12 text-indigo-500 mx-auto mb-3" />
              <p className="font-semibold text-gray-900">Kéo thả tệp vào đây</p>
              <p className="text-sm text-gray-500 mt-1">
                hoặc <span className="text-indigo-600 font-medium">chọn từ máy tính</span>
              </p>
              <p className="text-xs text-gray-400 mt-3">
                Hỗ trợ: PDF, DOCX, PPTX, TXT, MP3, MP4 — tối đa 100MB
              </p>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.docx,.pptx,.txt,.mp3,.mp4"
                onChange={handleFile}
              />
            </label>
          )}

          {stage === "idle" && tab === "url" && (
            <div className="space-y-4">
              <div>
                <label className="label">Đường dẫn trang web</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://vi.wikipedia.org/wiki/..."
                  className="input"
                />
                <p className="text-xs text-gray-500 mt-1.5">
                  Hệ thống sẽ trích xuất văn bản chính và tạo câu hỏi từ đó.
                </p>
              </div>
              <button
                onClick={startUpload}
                disabled={!url}
                className="btn-primary"
              >
                <Upload className="w-4 h-4" /> Tải URL về
              </button>
            </div>
          )}

          {stage === "idle" && tab === "youtube" && (
            <div className="space-y-4">
              <div>
                <label className="label">Liên kết YouTube</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="input"
                />
                <p className="text-xs text-gray-500 mt-1.5">
                  Phụ đề và transcript sẽ được trích xuất để tạo câu hỏi.
                </p>
              </div>
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-900">
                <strong>Lưu ý:</strong> Video phải có phụ đề (CC) hoặc thuộc thể loại có thể trích xuất giọng nói.
              </div>
              <button
                onClick={startUpload}
                disabled={!url}
                className="btn-primary"
              >
                <Youtube className="w-4 h-4" /> Phân tích video
              </button>
            </div>
          )}

          {stage !== "idle" && (
            <div className="space-y-5 py-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    stage === "completed"
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-indigo-100 text-indigo-600"
                  }`}
                >
                  {stage === "completed" ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {fileName || url || "tài liệu mới"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {stage === "uploading" && "Đang tải lên..."}
                    {stage === "processing" && "AI đang phân tích nội dung..."}
                    {stage === "completed" && "Hoàn tất! Đang chuyển..."}
                  </p>
                </div>
              </div>

              {stage === "uploading" && (
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                    <span>Tiến độ tải lên</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              <ProcessingSteps stage={stage} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProcessingSteps({ stage }: { stage: Stage }) {
  const steps = [
    { id: "uploading", label: "Tải lên" },
    { id: "processing", label: "Trích xuất nội dung" },
    { id: "completed", label: "Sẵn sàng tạo câu hỏi" },
  ];
  const idx = steps.findIndex((s) => s.id === stage);

  return (
    <div className="flex items-center gap-2">
      {steps.map((s, i) => (
        <div key={s.id} className="flex items-center gap-2 flex-1">
          <div
            className={`flex-1 h-1 rounded-full ${
              i <= idx ? "bg-indigo-500" : "bg-gray-200"
            }`}
          />
          <span
            className={`text-xs whitespace-nowrap ${
              i <= idx ? "text-indigo-600 font-medium" : "text-gray-400"
            }`}
          >
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}
