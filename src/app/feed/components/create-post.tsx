"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ImagePlus } from "lucide-react"

export function CreatePost() {
  const { data: session } = useSession()
  const [content, setContent] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userProfile, setUserProfile] = useState<{ avatarUrl?: string | null }>({})

  // Buscar o perfil do usuário
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch(`/api/profile?email=${session.user.email}`)
          const data = await response.json()
          setUserProfile(data)
        } catch (error) {
          console.error('Error fetching user profile:', error)
        }
      }
    }

    fetchUserProfile()
  }, [session?.user?.email])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      // TODO: Implementar upload da imagem
      console.log("Upload image:", files[0])
    }
  }

  const handleSubmit = async () => {
    if (!content.trim()) return
    
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          images
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create post')
      }

      setContent("")
      setImages([])
      // Recarregar a lista de posts (você pode usar um estado global ou context para isso)
      window.location.reload()
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage 
              src={userProfile.avatarUrl || session?.user?.image || undefined} 
              alt={session?.user?.name || "User"} 
            />
            <AvatarFallback>
              {session?.user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-4">
            <Textarea
              placeholder="O que você quer compartilhar?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px] bg-white/5"
            />
            <div className="flex justify-between items-center">
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                  multiple
                />
                <label 
                  htmlFor="image-upload"
                  className="flex items-center gap-2 text-sm text-white/70 hover:text-white cursor-pointer transition-colors"
                >
                  <ImagePlus className="h-5 w-5" />
                </label>
              </div>
              <Button
                onClick={handleSubmit}
                disabled={!content.trim() || isSubmitting}
              >
                Publicar
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 