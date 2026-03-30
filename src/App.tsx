import { useState } from "react";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./components/sign-in-form";
import { SignOutButton } from "./components/sign-out-button";
import { Toaster } from "sonner";
import PricePredictorForm from "./components/price-predictor-form";
import PredictionHistory from "./components/prediction-history";

export default function App() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <header className="sticky top-0 z-10 bg-surface-lowest/80 backdrop-blur-sm h-16 flex justify-between items-center px-6 shadow-[0_1px_0_0_rgba(0,51,77,0.05)]">
        <button
          onClick={() => setShowLogin(false)}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-9 h-9 rounded-md bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h8m-8 5h8m-4 7V4m-6 9l-2 2m10-2l2 2m-4-4l2 2" />
            </svg>
          </div>
          <h2 className="text-lg font-display font-bold text-on-surface">RidePrice<span className="text-secondary">AI</span></h2>
        </button>
        <Unauthenticated>
          {!showLogin && (
            <button
              onClick={() => setShowLogin(true)}
              className="text-sm text-secondary font-medium hover:text-primary transition-colors"
            >
              Entrar
            </button>
          )}
        </Unauthenticated>
        <Authenticated>
          <SignOutButton />
        </Authenticated>
      </header>

      <main className="flex-1 flex flex-col items-center justify-start pt-12 pb-16">
        <div className="w-full max-w-2xl mx-auto flex flex-col gap-10">
          {showLogin ? (
            <LoginPage onBack={() => setShowLogin(false)} />
          ) : (
            <Content onLoginClick={() => setShowLogin(true)} />
          )}
        </div>
      </main>
      <Toaster theme="light" position="bottom-center" />
    </div>
  );
}

function LoginPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="animate-fade-in">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface text-sm mb-8 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Voltar
      </button>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-display font-bold text-on-surface mb-2">Bem-vindo de volta</h1>
        <p className="text-on-surface-variant">Entre para salvar seu histórico de consultas</p>
      </div>
      <div className="bg-surface-variant/60 backdrop-blur-[20px] border border-outline/10 rounded-container p-8">
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
        <div className="w-10 h-10 rounded-full border-2 border-surface-variant border-t-primary animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <div className="text-center">
        <h1 className="text-4xl font-display font-bold text-on-surface mb-3 tracking-tight">
          Previsão de Preço de Corrida
        </h1>
        <p className="text-on-surface-variant text-lg max-w-md mx-auto">
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
