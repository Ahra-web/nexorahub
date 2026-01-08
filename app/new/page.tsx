import Link from "next/link";
import supabaseServer from "@/lib/supabaseServer"; // default import

// 동적 렌더링 강제 (캐싱 방지)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function NewPage() {
  const { data: postsData } = await supabaseServer
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false }); // 최신순

  const posts = postsData ?? [];

  return (
    <div className="min-h-screen text-white pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto flex flex-col gap-4">
        <h1 className="text-2xl font-semibold text-blue-300 mb-4">New Posts</h1>
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
