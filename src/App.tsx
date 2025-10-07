import { Route, Routes, Navigate, HashRouter } from "react-router-dom";
import "./App.css";
import WelcomePage from "./pages/WelcomePage";
import AuthForm from "./components/AuthForm";
import AuthCallback from "./pages/AuthCallback";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthGuard from "./components/AuthGuard";

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <HashRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <AuthGuard>
                    <WelcomePage />
                  </AuthGuard>
                }
              />
              <Route
                path="/login"
                element={
                  <AuthGuard>
                    <AuthForm />
                  </AuthGuard>
                }
              />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </HashRouter>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
