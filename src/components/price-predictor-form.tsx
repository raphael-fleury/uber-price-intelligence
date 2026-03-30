import { useState } from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import PredictionResult from "./prediction-result";

type PredictionData = {
  classification: string;
  classificationLevel: number;
  reasoning: string;
  factors: string[];
};

type Props = {
  onLoginClick: () => void;
};

export default function PricePredictorForm({ onLoginClick }: Props) {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const predictPrice = useAction(api.predictions.predictPrice);
  const loggedInUser = useQuery(api.auth.loggedInUser);

  const today = new Date().toISOString().split("T")[0];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!origin || !destination || !date || !time) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const data = await predictPrice({ origin, destination, date, time });
      setResult(data as PredictionData);
    } catch (err) {
      setError("Erro ao processar a previsão. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
        <h2 className="text-white font-semibold text-lg mb-5 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 text-xs">📍</span>
          Detalhes da Corrida
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-400 text-sm font-medium">Origem</label>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="Ex: Av. Paulista, São Paulo"
                className="bg-slate-900/80 border border-slate-600/50 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition-all"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-400 text-sm font-medium">Destino</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Ex: Aeroporto de Congonhas"
                className="bg-slate-900/80 border border-slate-600/50 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-400 text-sm font-medium">Data</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={today}
                className="bg-slate-900/80 border border-slate-600/50 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition-all [color-scheme:dark]"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-400 text-sm font-medium">Horário</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="bg-slate-900/80 border border-slate-600/50 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition-all [color-scheme:dark]"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !origin || !destination || !date || !time}
            className="mt-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-900/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Analisando corrida...
              </>
            ) : (
              <>
                <span>🔍</span>
                Prever Preço
              </>
            )}
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700/50 rounded-2xl p-4 text-red-300 text-sm text-center">
          {error}
        </div>
      )}

      {loading && (
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-sm flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-slate-700 border-t-violet-500 animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-2xl">🚗</div>
          </div>
          <div className="text-center">
            <p className="text-white font-medium">Analisando dados históricos...</p>
            <p className="text-slate-400 text-sm mt-1">Verificando padrões de preço, horário e condições</p>
          </div>
        </div>
      )}

      {result && !loading && (
        <>
          <PredictionResult
            result={result}
            origin={origin}
            destination={destination}
            date={date}
            time={time}
          />
          {loggedInUser === null && (
            <div className="bg-slate-800/60 border border-violet-500/30 rounded-2xl p-5 backdrop-blur-sm flex items-center justify-between gap-4 animate-fade-in">
              <div>
                <p className="text-white font-medium text-sm">Salve seu histórico de consultas</p>
                <p className="text-slate-400 text-xs mt-0.5">Crie uma conta gratuita para acessar suas previsões anteriores</p>
              </div>
              <button
                onClick={onLoginClick}
                className="shrink-0 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg"
              >
                Entrar
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
