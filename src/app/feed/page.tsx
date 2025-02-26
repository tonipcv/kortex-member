import { CreatePost } from "./components/create-post"
import { PostList } from "./components/post-list"

export default function FeedPage() {
  return (
    <div className="flex-1 p-8 pt-24 pb-28 lg:pt-6 lg:pb-6">
      <div className="max-w-3xl mx-auto">
        <CreatePost />
        <PostList />
      </div>
    </div>
  )
} 