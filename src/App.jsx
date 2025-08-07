import "./App.css";
import Dashboard from "./pages/dashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import SetupAccount from "./pages/SetupAccount";
import SetupPin from "./pages/SetupPin";
import ElpLogin from "./pages/ElpLogin";
import ElpGenerate from "./pages/ElpGenerate";
import Profile from "./pages/Profile";
import Support from "./pages/Support";
import AddToken from "./pages/AddToken";
import TokenHandler from "./pages/TokenHandler";
import Inbox from "./pages/Inbox";
import Appearance from "./pages/Appearance";
import ManageELP from "./pages/ManageELP";
import BackupRestore from "./pages/BackupRestore";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPasswordTest from "./pages/ResetPasswordTest";
import ResetPasswordRedirect from "./components/ResetPasswordRedirect";
import NotFound404 from "./pages/NotFound404";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./contexts/ThemeContext";
import "./styles/themes/index.css";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="*" element={<NotFound404 />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ForgotPassword />} />
          <Route
            path="/reset-password.html"
            element={<ResetPasswordRedirect />}
          />
          <Route path="/reset-test" element={<ResetPasswordTest />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/elp-login" element={<ElpLogin />} />
          <Route path="/auth/token-handler" element={<TokenHandler />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/setup-account"
            element={
              <ProtectedRoute>
                <SetupAccount />
              </ProtectedRoute>
            }
          />
          <Route
            path="/setup-pin"
            element={
              <ProtectedRoute>
                <SetupPin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-token"
            element={
              <ProtectedRoute>
                <AddToken />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/support"
            element={
              <ProtectedRoute>
                <Support />
              </ProtectedRoute>
            }
          />
          <Route
            path="/elp-generate"
            element={
              <ProtectedRoute>
                <ElpGenerate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inbox"
            element={
              <ProtectedRoute>
                <Inbox />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appearance"
            element={
              <ProtectedRoute>
                <Appearance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-elp"
            element={
              <ProtectedRoute>
                <ManageELP />
              </ProtectedRoute>
            }
          />
          <Route
            path="/backup-restore"
            element={
              <ProtectedRoute>
                <BackupRestore />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
