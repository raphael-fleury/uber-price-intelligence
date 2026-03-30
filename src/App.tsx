import { useState } from "react";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import PricePredictorForm from "./PricePredictorForm";
import PredictionHistory from "./PredictionHistory";

export default function App() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-sm h-16 flex justify-between items-center border-b border-slate-700/50 shadow-lg px-6">
        <button
          onClick={() => setShowLogin(false)}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <span className="text-white text-sm font-bold">🚗</span>
          </div>
          <h2 className="text-lg font-semibold text-white">RidePrice<span className="text-violet-400">AI</span></h2>
        </button>
        <Unauthenticated>
          {!showLogin && (
            <button
              onClick={() => setShowLogin(true)}
              className="text-sm text-violet-400 hover:text-violet-300 font-medium transition-colors"
            >
              Entrar
            </button>
          )}
        </Unauthenticated>
        <Authenticated>
          <SignOutButton />
        </Authenticated>
      </header>

      <main className="flex-1 flex flex-col items-center justify-start p-6 pt-10">
        <div className="w-full max-w-2xl mx-auto flex flex-col gap-8">
          {showLogin ? (
            <LoginPage onBack={() => setShowLogin(false)} />
          ) : (
            <Content onLoginClick={() => setShowLogin(true)} />
          )}
        </div>
      </main>
      <Toaster theme="dark" />
    </div>
  );
}

function LoginPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="animate-fade-in">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors"
      >
        <span>←</span> Voltar
      </button>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Bem-vindo de volta</h1>
        <p className="text-slate-400">Entre para salvar seu histórico de consultas</p>
      </div>
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-sm shadow-xl">
        <SignInForm />
      </div>
    </div>
  );
}

function Content({ onLoginClick }: { onLoginClick: () => void }) {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-400"></div>
      </div>
    );
  }

  return (
    <>
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-3">
          Previsão de Preço de Corrida
        </h1>
        <p className="text-slate-400 text-lg">
          Descubra se o preço da sua corrida estará acima ou abaixo do normal
        </p>
      </div>

      <PricePredictorForm onLoginClick={onLoginClick} />

      <Authenticated>
        <PredictionHistory />
      </Authenticated>
    </>
  );
}
