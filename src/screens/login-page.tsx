import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { SignInForm } from "../components/sign-in-form";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  const handleSuccess = () => {
    navigate("/");
  };

  return (
    <div className="animate-fade-in">
      
      <div className="text-center mb-8">
        <h1 className="text-3xl font-display font-bold text-on-surface mb-2">Bem-vindo de volta</h1>
        <p className="text-on-surface-variant">Entre para salvar seu histórico de consultas</p>
      </div>
      <div className="bg-surface-variant/60 backdrop-blur-[20px] border border-outline/10 rounded-container p-8 max-w-md mx-auto">
        <SignInForm onSuccess={handleSuccess} />
      </div>
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface text-sm mb-8 transition-colors max-w-md mx-auto mt-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </button>
    </div>
  );
}
