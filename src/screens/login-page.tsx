import { ArrowLeft } from "lucide-react";
import { SignInForm } from "../components/sign-in-form";

type LoginPageProps = {
  onBack: () => void;
};

export default function LoginPage({ onBack }: LoginPageProps) {
  return (
    <div className="animate-fade-in max-w-md mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface text-sm mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
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
