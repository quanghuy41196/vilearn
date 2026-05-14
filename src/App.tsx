import { Navigate, Route, Routes, useSearchParams } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import AppLayout from "./components/layout/AppLayout";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import ContentListPage from "./pages/content/ContentListPage";
import UploadPage from "./pages/content/UploadPage";
import QuizListPage from "./pages/quiz/QuizListPage";
import QuizDetailPage from "./pages/quiz/QuizDetailPage";
import GeneratePage from "./pages/quiz/GeneratePage";
import PracticePage from "./pages/practice/PracticePage";
import ReviewPage from "./pages/review/ReviewPage";
import ClassListPage from "./pages/class/ClassListPage";
import ClassDetailPage from "./pages/class/ClassDetailPage";
import AssignmentPage from "./pages/assignment/AssignmentPage";
import TakeAssignmentPage from "./pages/assignment/TakeAssignmentPage";
import HostLobbyPage from "./pages/game/HostLobbyPage";
import PlayerJoinPage from "./pages/game/PlayerJoinPage";
import PlayerGamePage from "./pages/game/PlayerGamePage";

function PlayRedirect() {
  const [searchParams] = useSearchParams();
  const pin = searchParams.get("pin") ?? "";
  return <Navigate to={`/game/join${pin ? `?pin=${pin}` : ""}`} replace />;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/game/join" element={<PlayerJoinPage />} />
      <Route path="/play" element={<PlayRedirect />} />
      <Route path="/game/play" element={<PlayerGamePage />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="contents" element={<ContentListPage />} />
        <Route path="upload" element={<UploadPage />} />
        <Route path="quizzes" element={<QuizListPage />} />
        <Route path="quizzes/new" element={<QuizDetailPage />} />
        <Route path="quizzes/:id" element={<QuizDetailPage />} />
        <Route path="generate" element={<GeneratePage />} />
        <Route path="practice/:id" element={<PracticePage />} />
        <Route path="review" element={<ReviewPage />} />
        <Route path="classes" element={<ClassListPage />} />
        <Route path="classes/:id" element={<ClassDetailPage />} />
        <Route path="assignments" element={<AssignmentPage />} />
        <Route path="assignments/take/:id" element={<TakeAssignmentPage />} />
        <Route path="game/host" element={<HostLobbyPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
