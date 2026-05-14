import { Trash2, GripVertical, ArrowUp, ArrowDown, Plus } from "lucide-react";
import type { Question } from "../../types";

interface Props {
  question: Question;
  index: number;
  onUpdate: (q: Question) => void;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export default function QuestionEditor({
  question,
  index,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
}: Props) {
  const toggleCorrect = (optId: string) => {
    onUpdate({
      ...question,
      options: question.options.map((o) =>
        o.id === optId ? { ...o, isCorrect: !o.isCorrect } : o
      ),
    });
  };

  const updateOptionText = (optId: string, text: string) => {
    onUpdate({
      ...question,
      options: question.options.map((o) =>
        o.id === optId ? { ...o, text } : o
      ),
    });
  };

  const addOption = () => {
    const newId = `opt-${Date.now()}`;
    onUpdate({
      ...question,
      options: [...question.options, { id: newId, text: "", isCorrect: false }],
    });
  };

  const removeOption = (optId: string) => {
    onUpdate({
      ...question,
      options: question.options.filter((o) => o.id !== optId),
    });
  };

  return (
    <div className="card p-5">
      <div className="flex items-start gap-3 mb-4">
        <div className="flex flex-col gap-1 pt-1.5">
          <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
          <span className="text-xs font-semibold text-gray-500">#{index + 1}</span>
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex gap-2">
            <select
              value={question.type}
              onChange={(e) =>
                onUpdate({ ...question, type: e.target.value as Question["type"] })
              }
              className="input max-w-[180px]"
            >
              <option value="multiple_choice">Trắc nghiệm</option>
              <option value="true_false">Đúng/Sai</option>
              <option value="fill_blank">Điền khuyết</option>
              <option value="short_answer">Tự luận ngắn</option>
            </select>
          </div>

          <textarea
            value={question.text}
            onChange={(e) => onUpdate({ ...question, text: e.target.value })}
            placeholder="Nhập câu hỏi..."
            rows={2}
            className="input resize-none"
          />

          <div className="space-y-2">
            {question.options.map((opt, i) => (
              <div key={opt.id} className="flex items-center gap-2">
                <button
                  onClick={() => toggleCorrect(opt.id)}
                  className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${
                    opt.isCorrect
                      ? "bg-emerald-500 border-emerald-500"
                      : "border-gray-300"
                  }`}
                  title="Đánh dấu đáp án đúng"
                >
                  {opt.isCorrect && (
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <span className="text-xs font-semibold text-gray-500 w-5">
                  {String.fromCharCode(65 + i)}.
                </span>
                <input
                  value={opt.text}
                  onChange={(e) => updateOptionText(opt.id, e.target.value)}
                  placeholder={`Phương án ${String.fromCharCode(65 + i)}`}
                  className="input flex-1"
                />
                <button
                  onClick={() => removeOption(opt.id)}
                  className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={addOption}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Thêm phương án
            </button>
          </div>

          <div>
            <label className="label">Giải thích (tuỳ chọn)</label>
            <textarea
              value={question.explanation ?? ""}
              onChange={(e) =>
                onUpdate({ ...question, explanation: e.target.value })
              }
              rows={2}
              className="input resize-none"
              placeholder="Giải thích cho đáp án đúng..."
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <button
            onClick={onMoveUp}
            disabled={!onMoveUp}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded disabled:opacity-30"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <button
            onClick={onMoveDown}
            disabled={!onMoveDown}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded disabled:opacity-30"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
          <button
            onClick={onRemove}
            className="p-1.5 text-gray-400 hover:text-rose-600 rounded"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
