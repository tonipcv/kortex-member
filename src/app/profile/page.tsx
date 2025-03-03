'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Image as ImageIcon, LogOut } from "lucide-react";
import { PageWrapper } from "@/components/PageWrapper";
import Navigation from "@/components/Navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/signin');
    },
  });

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    image: ''
  });

  useEffect(() => {
    if (status === 'authenticated') {
      fetchProfile();
    }
  }, [status]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/profile');
      
      if (!response.ok) {
        throw new Error('Erro ao buscar perfil');
      }

      const data = await response.json();
      setProfile(data);
      setFormData({
        name: data.name || '',
        image: data.image || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Erro ao carregar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar perfil');
      }

      await fetchProfile();
      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Erro ao atualizar perfil');
    }
  };

  if (loading) {
    return (
      <PageWrapper>
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <div className="text-gray-900">Carregando...</div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Navigation />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-medium text-gray-900">Perfil</h2>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-medium text-gray-900">
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center mb-8">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile?.image || ''} alt={profile?.name || 'Avatar'} />
                  <AvatarFallback className="bg-gray-100 text-gray-600 text-xl">
                    {profile?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700">
                    Nome
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-10 bg-white border-gray-200"
                      placeholder="Seu nome completo"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      value={profile?.email || ''}
                      disabled
                      className="pl-10 bg-gray-50 border-gray-200 text-gray-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image" className="text-gray-700">
                    URL da Imagem
                  </Label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="image"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="pl-10 bg-white border-gray-200"
                      placeholder="URL da sua foto de perfil"
                    />
                  </div>
                </div>

                <div className="pt-6 space-y-4">
                  <Button 
                    type="submit"
                    className="w-full bg-gray-900 text-white hover:bg-gray-800"
                  >
                    Salvar Alterações
                  </Button>

                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                    className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sair da Conta</span>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
} 