import { useState } from "react";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./components/sign-in-form";
import { SignOutButton } from "./components/sign-out-button";
import { Toaster } from "sonner";
import PricePredictorForm from "./components/price-predictor-form";
import PredictionResult from "./components/prediction-result";
import PredictionHistory from "./components/prediction-history";
import { Card } from "./components/ui/card";

type PredictionData = {
  classification: string;
  classificationLevel: number;
  reasoning: string;
  factors: string[];
};

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

      <main className="flex-1 flex flex-col items-center justify-start pt-12 pb-16 px-4 sm:px-6">
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-10">
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
    <div className="animate-fade-in max-w-md mx-auto">
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

      <PredictionLayout onLoginClick={onLoginClick} />

      <Authenticated>
        <PredictionHistory />
      </Authenticated>
    </>
  );
}

function PredictionLayout({ onLoginClick }: { onLoginClick: () => void }) {
  const [prediction, setPrediction] = useState<{
    data: PredictionData;
    origin: string;
    destination: string;
    date: string;
    time: string;
  } | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <PricePredictorForm onPrediction={setPrediction} />
      <div className="flex flex-col gap-6">
        {prediction ? (
          <>
            <PredictionResult
              result={prediction.data}
              origin={prediction.origin}
              destination={prediction.destination}
              date={prediction.date}
              time={prediction.time}
            />
            <Card variant="glass" padding="md" className="flex flex-row items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-on-surface text-sm">Quer mais precisão?</p>
                <p className="text-xs text-on-surface-variant mt-1">
                  <button onClick={onLoginClick} className="text-secondary font-medium hover:underline">Crie uma conta</button> para monitorar suas rotas favoritas e receber alertas de volatilidade em tempo real.
                </p>
              </div>
            </Card>
          </>
        ) : (
          <Card variant="glass" padding="lg" className="hidden lg:flex flex-1 min-h-[300px] items-center justify-center">
            <div className="text-center text-on-surface-variant">
              <svg className="w-12 h-12 mx-auto mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-sm">Preencha o formulário ao lado para ver a previsão</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
