"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function SignInForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="w-full">
      <form
        className="flex flex-col gap-5"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitting(true);
          const formData = new FormData(e.target as HTMLFormElement);
          formData.set("flow", flow);
          void signIn("password", formData).catch((error) => {
            let toastTitle = "";
            if (error.message.includes("Invalid password")) {
              toastTitle = "Senha inválida. Tente novamente.";
            } else {
              toastTitle =
                flow === "signIn"
                  ? "Não foi possível entrar. Deseja criar uma conta?"
                  : "Não foi possível criar conta. Deseja entrar?";
            }
            toast.error(toastTitle);
            setSubmitting(false);
          });
        }}
      >
        <Input
          type="email"
          name="email"
          label="Email"
          placeholder="seu@email.com"
          required
        />
        <Input
          type="password"
          name="password"
          label="Senha"
          placeholder="••••••••"
          required
        />
        <Button type="submit" fullWidth loading={submitting}>
          {flow === "signIn" ? "Entrar" : "Criar conta"}
        </Button>
        <div className="text-center text-sm text-on-surface-variant">
          <span>
            {flow === "signIn"
              ? "Não tem uma conta? "
              : "Já tem uma conta? "}
          </span>
          <button
            type="button"
            className="text-secondary font-medium hover:text-primary transition-colors"
            onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
          >
            {flow === "signIn" ? "Criar conta" : "Entrar"}
          </button>
        </div>
      </form>
      <div className="flex items-center justify-center my-5">
        <div className="h-px bg-outline/20 flex-1"></div>
        <span className="mx-4 text-on-surface-variant text-sm">ou</span>
        <div className="h-px bg-outline/20 flex-1"></div>
      </div>
      <Button variant="secondary" fullWidth onClick={() => void signIn("anonymous")}>
        Continuar como visitante
      </Button>
    </div>
  );
}
