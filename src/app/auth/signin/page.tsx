'use client';

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/ui/logo";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Componente do Logo com três traços horizontais
const Logo = () => (
  <div className="flex flex-col gap-1.5">
    <div className="h-0.5 w-6 bg-gray-900"></div>
    <div className="h-0.5 w-8 bg-gray-900"></div>
    <div className="h-0.5 w-6 bg-gray-900"></div>
  </div>
);

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email ou senha inválidos");
      } else {
        router.refresh();
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      setError("Ocorreu um erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo e Título */}
        <div className="flex flex-col items-center space-y-2">
          <Logo />
          <span className="text-xs font-medium text-gray-900 tracking-wide mt-2">
            FINANCY·AI
          </span>
        </div>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="text-center pb-2">
            <h1 className="text-xl font-medium text-gray-900">
              Bem-vindo de volta
            </h1>
            <p className="text-sm text-gray-500">
              Faça login para continuar
            </p>
          </CardHeader>

          <CardContent className="space-y-4 pt-4">
            {!showEmailForm ? (
              <>
                <Button
                  onClick={handleGoogleSignIn}
                  className="w-full bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 hover:border-gray-300 flex items-center justify-center gap-2 h-11"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continuar com Google
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      ou
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => setShowEmailForm(true)}
                  className="w-full bg-gray-900 text-white hover:bg-gray-800 flex items-center justify-center gap-2 h-11"
                >
                  Entrar com Email
                </Button>
              </>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-500 [&:-webkit-autofill]:!bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-500 [&:-webkit-autofill]:!bg-white"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}

                <div className="pt-2 space-y-2">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gray-900 text-white hover:bg-gray-800 h-11"
                  >
                    {isLoading ? "Entrando..." : "Entrar"}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowEmailForm(false)}
                    className="w-full border-gray-200 text-gray-600 hover:bg-gray-50 h-11"
                  >
                    Voltar
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-500">
          Não tem uma conta?{' '}
          <a href="/auth/signup" className="text-gray-900 hover:underline">
            Criar conta
          </a>
        </p>
      </div>
    </div>
  );
} 