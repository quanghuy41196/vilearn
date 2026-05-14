import { Check } from "lucide-react";
import type { Question } from "../../types";

interface Props {
  question: Question;
  index: number;
  selected?: string;
  onSelect?: (optionId: string) => void;
  showAnswer?: boolean;
}

export default function QuestionCard({
  question,
  index,
  selected,
  onSelect,
  showAnswer,
}: Props) {
  return (
    <div className="card p-6 animate-slide-up">
      <div className="flex items-center gap-2 mb-3">
        <span className="badge bg-indigo-100 text-indigo-700">Câu {index + 1}</span>
        <span className="badge bg-gray-100 text-gray-600 capitalize">
          {question.type.replace("_", " ")}
        </span>
      </div>
      <p className="text-lg font-semibold text-gray-900 mb-5 leading-relaxed">
        {question.text}
      </p>
      <div className="space-y-2">
        {question.options.map((opt, i) => {
          const isSelected = selected === opt.id;
          const isCorrect = opt.isCorrect;
          const colors = ["bg-rose-500", "bg-blue-500", "bg-amber-500", "bg-emerald-500"];
          return (
            <button
              key={opt.id}
              onClick={() => onSelect?.(opt.id)}
              disabled={!onSelect && !showAnswer}
              className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all flex items-center gap-3 ${
                showAnswer && isCorrect
                  ? "border-emerald-500 bg-emerald-50"
                  : showAnswer && isSelected && !isCorrect
                    ? "border-rose-500 bg-rose-50"
                    : isSelected
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <span
                className={`w-7 h-7 rounded-md flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 ${colors[i % colors.length]}`}
              >
                {String.fromCharCode(65 + i)}
              </span>
              <span className="text-sm text-gray-800 flex-1">{opt.text}</span>
              {showAnswer && isCorrect && (
                <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>
      {showAnswer && question.explanation && (
        <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-100">
          <p className="text-xs font-semibold text-blue-900 mb-1">Giải thích</p>
          <p className="text-sm text-blue-800">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
