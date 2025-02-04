'use client';

import { useSession, signOut } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "@/components/ui/image-upload";
import Image from "next/image";
import { CameraIcon } from "lucide-react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    fullName: '',
    nickname: '',
    documentId: '',
    birthDate: '',
    phone: '',
    country: '',
    instagram: '',
    youtube: '',
    bio: '',
    avatarUrl: '',
    coverUrl: '',
    postalCode: '',
    address: '',
    addressNumber: '',
    complement: '',
    state: '',
    city: '',
  });

  // Carregar dados do perfil
  useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch(`/api/profile?email=${session.user.email}`);
          const data = await response.json();
          if (data) {
            setProfile(prev => ({
              ...prev,
              ...data
            }));
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
    };

    fetchProfile();
  }, [session?.user?.email]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedProfile = await response.json();
      setProfile(prev => ({
        ...prev,
        ...updatedProfile
      }));
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto p-4 pt-20 lg:pt-10">
      <Card className="bg-background/50 backdrop-blur">
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="personal">Informações Pessoais</TabsTrigger>
              <TabsTrigger value="social">Redes Sociais</TabsTrigger>
              <TabsTrigger value="address">Endereço</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-white/70">Nome Completo</label>
                  <Input
                    name="fullName"
                    value={profile.fullName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="bg-white/5"
                  />
                </div>

          <div className="space-y-2">
                  <label className="text-sm text-white/70">Apelido</label>
              <Input
                    name="nickname"
                    value={profile.nickname}
                    onChange={handleChange}
                    disabled={!isEditing}
                className="bg-white/5"
              />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white/70">Email</label>
                  <Input
                    value={profile.email}
                    disabled
                    className="bg-white/5"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-white/70">Documento</label>
                  <Input
                    name="documentId"
                    value={profile.documentId}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="bg-white/5"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-white/70">Data de Nascimento</label>
                  <Input
                    type="date"
                    name="birthDate"
                    value={profile.birthDate}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="bg-white/5"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-white/70">Telefone</label>
                  <Input
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="bg-white/5"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-white/70">País</label>
                  <Input
                    name="country"
                    value={profile.country}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="bg-white/5"
                  />
                </div>

                <div className="col-span-full space-y-2">
                  <label className="text-sm text-white/70">Sobre Mim</label>
                  <Textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="bg-white/5 min-h-[100px]"
                  />
                </div>

                <div className="col-span-full flex flex-col items-center gap-4 mb-6">
                  <div className="space-y-2 text-center">
                    <label className="text-sm text-white/70">Foto de Perfil</label>
                    <ImageUpload
                      value={profile.avatarUrl}
                      onChange={(value) => setProfile(prev => ({ ...prev, avatarUrl: value }))}
                      disabled={!isEditing}
                      className="mx-auto"
                    />
                  </div>
                  <div className="space-y-2 text-center">
                    <label className="text-sm text-white/70">Imagem de Capa</label>
                    <div className="relative w-full h-[100px] rounded-lg overflow-hidden">
                      {profile.coverUrl ? (
                        <Image
                          src={profile.coverUrl}
                          alt="Cover"
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <div className="w-full h-full bg-white/5 flex items-center justify-center">
                          <CameraIcon className="h-6 w-6 text-white/70" />
                        </div>
                      )}
                      {isEditing && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                          <ImageUpload
                            value={profile.coverUrl}
                            onChange={(value) => setProfile(prev => ({ ...prev, coverUrl: value }))}
                            disabled={!isEditing}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="social" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-white/70">Instagram</label>
                  <Input
                    name="instagram"
                    value={profile.instagram}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="bg-white/5"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-white/70">YouTube</label>
                  <Input
                    name="youtube"
                    value={profile.youtube}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="bg-white/5"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="address" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-white/70">CEP</label>
                  <Input
                    name="postalCode"
                    value={profile.postalCode}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="bg-white/5"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-white/70">Endereço</label>
                  <Input
                    name="address"
                    value={profile.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="bg-white/5"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-white/70">Número</label>
                  <Input
                    name="addressNumber"
                    value={profile.addressNumber}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="bg-white/5"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-white/70">Complemento</label>
                  <Input
                    name="complement"
                    value={profile.complement}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="bg-white/5"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-white/70">Estado</label>
                  <Input
                    name="state"
                    value={profile.state}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="bg-white/5"
                  />
          </div>

                <div className="space-y-2">
                  <label className="text-sm text-white/70">Cidade</label>
                  <Input
                    name="city"
                    value={profile.city}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="bg-white/5"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="pt-4 space-y-4">
            {isEditing ? (
              <div className="flex gap-2">
                <Button onClick={handleSave}>Salvar</Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
              </div>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Editar Perfil</Button>
            )}

            <Button 
              variant="ghost" 
              className="w-full text-white/70 hover:text-white"
              onClick={() => signOut({ callbackUrl: '/auth/signin' })}
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 