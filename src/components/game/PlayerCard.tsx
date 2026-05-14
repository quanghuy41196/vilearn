import type { GamePlayer } from "../../types";

interface Props {
  player: GamePlayer;
  rank?: number;
}

export default function PlayerCard({ player, rank }: Props) {
  return (
    <div className="card p-3 flex items-center gap-3 animate-slide-up">
      {rank !== undefined && (
        <span
          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${
            rank === 0
              ? "bg-amber-400"
              : rank === 1
                ? "bg-gray-400"
                : rank === 2
                  ? "bg-orange-400"
                  : "bg-gray-300"
          }`}
        >
          {rank + 1}
        </span>
      )}
      <span className="text-2xl">{player.avatar}</span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate">{player.name}</p>
        {player.streak > 0 && (
          <p className="text-[11px] text-orange-600">
            🔥 chuỗi {player.streak}
          </p>
        )}
      </div>
      <p className="font-bold text-indigo-600">{player.score.toLocaleString()}</p>
    </div>
  );
}
