import Link from "next/link";
import { supabaseServer } from "@/lib/supabaseServer";

export default async function PastPage() {
  const { data: postsData } = await supabaseServer
    .from("posts")
    .select("*")
    .order("created_at", { ascending: true }); // 오래된순

  const posts = postsData ?? [];

  return (
    <div className="min-h-screen text-white pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto flex flex-col gap-4">
        <h1 className="text-2xl font-semibold text-blue-300 mb-4">Past Posts</h1>
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/posts/${post.id}`}
            className="border border-white/10 p-4 rounded bg-gray-900 hover:bg-gray-800 transition"
          >
            <h2 className="text-lg font-bold text-blue-300">{post.title}</h2>
            <p className="text-white/80 mt-2 truncate">{post.content}</p>
            <span className="text-xs text-white/50 mt-1 block">
              {new Date(post.created_at).toLocaleString()}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
