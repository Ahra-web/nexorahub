import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default async function HomePage() {
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen  text-white pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto flex flex-col gap-4">
        <h1 className="text-2xl font-semibold text-blue-300 mb-4">Post list</h1>
        {posts?.map((post) => (
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