import Link from "next/link";
import supabaseServer from "@/lib/supabaseServer";

// 동적 렌더링 강제 (캐싱 방지)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const { data: posts, error } = await supabaseServer
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
    return (
      <div className="min-h-screen text-white pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-red-500">게시글을 불러오는 중 오류가 발생했습니다.</p>
        </div>
      </div>
    );
  }

  const postsList = posts ?? [];

  return (
    <div className="min-h-screen text-white pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto flex flex-col gap-4">
        <h1 className="text-2xl font-semibold text-blue-300 mb-4">Post list</h1>
        {postsList.length === 0 ? (
          <p className="text-white/60 text-center py-8">게시글이 없습니다.</p>
        ) : (
          postsList.map((post) => (
            <Link
              href={`/posts/${post.id}`}
              key={post.id}
              className="border border-white/10 p-4 rounded bg-gray-900 hover:bg-gray-800 transition"
            >
              <h2 className="text-lg font-bold text-blue-300">{post.title}</h2>
              <p className="text-white/80 mt-2 truncate">{post.content}</p>
              <span className="text-xs text-white/50 mt-1 block">
                {new Date(post.created_at).toLocaleString()}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
