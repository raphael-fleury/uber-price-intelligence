import { Activity } from "lucide-react";
import { Card } from "../ui/card";
import { Loading } from "../ui/spinner";

export function LoadingStateCard() {
  return (
    <Card variant="glass" padding="lg" className="flex flex-1 items-center justify-center min-h-[300px]">
      <Loading
        message="Analisando dados históricos..."
        submessage="Verificando padrões de preço, horário e condições"
      >
        <Activity className="w-7 h-7 text-primary" />
      </Loading>
    </Card>
  );
}
