import { BarChart3 } from "lucide-react";
import { Card } from "../ui/card";

export function EmptyStateCard() {
  return (
    <Card variant="glass" padding="lg" className="hidden lg:flex flex-1 min-h-[300px] items-center justify-center">
      <div className="text-center text-on-surface-variant">
        <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-30" />
        <p className="text-sm">Preencha o formulário ao lado para ver a previsão</p>
      </div>
    </Card>
  );
}
