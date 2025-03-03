'use client';

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);

  // Redireciona para o dashboard se já estiver autenticado
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  // Mostra loading enquanto verifica a sessão
  if (status === 'loading') {
    return null;
  }

  // Só mostra a página de login se não estiver autenticado
  if (status === 'unauthenticated') {
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
                      {/* ... SVG do Google ... */}
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
                  {/* ... Formulário de email ... */}
                </form>
              )}
            </CardContent>
          </Card>

          <p className="text-center text-sm text-gray-500">
            Não tem uma conta?{' '}
            <Link href="/auth/signup" className="text-gray-900 hover:underline">
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return null;
}
