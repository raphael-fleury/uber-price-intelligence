import { useState } from "react";
import { Toaster } from "sonner";
import Header from "./components/header";
import LoginPage from "./screens/login-page";
import PredictPage from "./screens/predict-page";
import SavedRoutesPage from "./screens/saved-routes-page";
import { features } from "./config/features";

type Page = "predict" | "saved-routes";

export default function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>("predict");

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Header
        showLogin={showLogin}
        onLoginClick={() => setShowLogin(true)}
        onLogoClick={() => {
          setShowLogin(false);
          setCurrentPage("predict");
        }}
        onSavedRoutesClick={() => setCurrentPage("saved-routes")}
      />

      <main className="flex-1 flex flex-col items-center justify-start pt-12 pb-16 px-4 sm:px-6">
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-10">
          {features.auth && showLogin ? (
            <LoginPage onBack={() => setShowLogin(false)} />
          ) : currentPage === "saved-routes" ? (
            <SavedRoutesPage onBackClick={() => setCurrentPage("predict")} />
          ) : (
            <PredictPage 
              onLoginClick={() => features.auth && setShowLogin(true)}
              onSavedRoutesNavigate={() => setCurrentPage("saved-routes")}
            />
          )}
        </div>
      </main>
      <Toaster theme="light" position="bottom-center" />
    </div>
  );
}
