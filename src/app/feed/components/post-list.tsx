"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface UserProfile {
  avatarUrl: string | null
  fullName: string | null
}

interface User {
  id: string
  name: string | null
  email: string | null
  image: string | null
  profile: UserProfile | null
}

interface Post {
  id: string
  content: string
  images: string[]
  likes: number
  userId: string
  user: User
  createdAt: string
  updatedAt: string
}

export function PostList() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts')
        const data = await response.json()
        setPosts(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Error fetching posts:', error)
        setPosts([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const formatDate = (date: string) => {
    return format(new Date(date), "dd/MM/yyyy 'às' HH:mm", {
      locale: ptBR
    })
  }

  if (isLoading) {
    return <div className="text-center text-white/70">Carregando posts...</div>
  }

  if (posts.length === 0) {
    return <div className="text-center text-white/70">Nenhum post encontrado.</div>
  }

  return (
    <div className="space-y-6">
      {Array.isArray(posts) && posts.map((post: Post) => (
        <Card key={post.id}>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar>
              <AvatarImage src={post.user.profile?.avatarUrl || post.user.image || undefined} />
              <AvatarFallback>
                {post.user.profile?.fullName?.charAt(0) || post.user.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">
                {post.user.profile?.fullName || post.user.name || "Usuário"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {formatDate(post.createdAt)}
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="whitespace-pre-wrap">{post.content}</p>
            {post.images.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {post.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Post image ${index + 1}`}
                    className="rounded-md w-full h-48 object-cover"
                  />
                ))}
              </div>
            )}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                {post.likes}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 