import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
//import { LoginForm } from "@/components/login-form";
import LoginPage from "./pages/login";
import DashboardPage from "./pages/dashboardPage";
import HabitDetailsPage from "./pages/HabitDetailsPage";
import RegisterPage from "./pages/registerPage";

import { AuthProvider } from "./hooks/useAuth";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/habits/:id" element={<HabitDetailsPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
