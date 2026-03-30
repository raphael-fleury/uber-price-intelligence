import { useState } from "react";
import { Toaster } from "sonner";
import Header from "./components/header";
import LoginPage from "./screens/login-page";
import PredictPage from "./screens/predict-page";

export default function App() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Header
        showLogin={showLogin}
        onLoginClick={() => setShowLogin(true)}
        onLogoClick={() => setShowLogin(false)}
      />

      <main className="flex-1 flex flex-col items-center justify-start pt-12 pb-16 px-4 sm:px-6">
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-10">
          {showLogin ? (
            <LoginPage onBack={() => setShowLogin(false)} />
          ) : (
            <PredictPage onLoginClick={() => setShowLogin(true)} />
          )}
        </div>
      </main>
      <Toaster theme="light" position="bottom-center" />
    </div>
  );
}
