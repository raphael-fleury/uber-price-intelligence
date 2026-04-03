"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const signInSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

type SignInFormData = z.infer<typeof signInSchema>;

export function SignInForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    setSubmitting(true);
    const formData = new FormData();
    formData.set("email", data.email);
    formData.set("password", data.password);
    formData.set("flow", flow);

    try {
      await signIn("password", formData);
    } catch (error: any) {
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
    } finally {
      setSubmitting(false);
    }
  };

  const toggleFlow = () => {
    setFlow(flow === "signIn" ? "signUp" : "signIn");
    reset();
  };

  return (
    <div className="w-full">
      <form
        className="flex flex-col gap-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          type="email"
          label="Email"
          placeholder="seu@email.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          type="password"
          label="Senha"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
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
            onClick={toggleFlow}
          >
            {flow === "signIn" ? "Criar conta" : "Entrar"}
          </button>
        </div>
      </form>
    </div>
  );
}
