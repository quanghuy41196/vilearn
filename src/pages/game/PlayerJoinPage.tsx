import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { GraduationCap, ArrowRight, Smile } from "lucide-react";

const avatars = ["🦁", "🐘", "🦊", "🐉", "🦅", "🐧", "🐼", "🐨", "🐯", "🦄", "🐸", "🦉"];

export default function PlayerJoinPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pinFromUrl = searchParams.get("pin") ?? "";
  const [step, setStep] = useState<1 | 2>(pinFromUrl.length === 6 ? 2 : 1);
  const [pin, setPin] = useState(pinFromUrl);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(avatars[0]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 text-white flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <div className="inline-flex w-14 h-14 bg-white/10 backdrop-blur rounded-2xl items-center justify-center mb-3">
          <GraduationCap className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-3xl font-bold">ViLearn Live</h1>
        <p className="text-indigo-100 mt-1">Tham gia game show</p>
      </div>

      <div className="bg-white text-gray-900 rounded-2xl p-8 w-full max-w-sm shadow-2xl">
        {step === 1 ? (
          <>
            <h2 className="text-xl font-bold mb-1">Nhập mã PIN</h2>
            <p className="text-sm text-gray-500 mb-5">Mã 6 chữ số trên màn hình của giáo viên</p>
            <input
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              className="w-full text-center text-3xl font-bold tracking-widest border-2 border-gray-200 rounded-lg py-4 focus:border-indigo-500 focus:outline-none"
              inputMode="numeric"
            />
            <button
              onClick={() => pin.length === 6 && setStep(2)}
              disabled={pin.length !== 6}
              className="btn-primary w-full mt-5 py-3"
            >
              Tiếp tục <ArrowRight className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-1">Tạo nickname</h2>
            <p className="text-sm text-gray-500 mb-5">Tên này sẽ hiển thị cho người chơi khác</p>

            <div>
              <label className="label">Chọn avatar</label>
              <div className="grid grid-cols-6 gap-2 mb-4">
                {avatars.map((a) => (
                  <button
                    key={a}
                    onClick={() => setAvatar(a)}
                    className={`aspect-square text-2xl rounded-lg border-2 ${
                      avatar === a ? "border-indigo-500 bg-indigo-50" : "border-gray-200"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Nickname</label>
              <div className="relative">
                <Smile className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, 20))}
                  placeholder="Sư tử dũng cảm"
                  className="input pl-9"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">{name.length}/20 ký tự</p>
            </div>

            <button
              onClick={() => name.length >= 2 && navigate("/game/play")}
              disabled={name.length < 2}
              className="btn-primary w-full mt-5 py-3"
            >
              Vào phòng chờ <ArrowRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      <p className="text-indigo-100 text-sm mt-6">
        Chưa có mã? Bạn có thể{" "}
        <button onClick={() => navigate("/login")} className="text-white font-semibold underline">
          đăng nhập
        </button>{" "}
        để tự tạo lớp.
      </p>
    </div>
  );
}
