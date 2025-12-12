import { supabaseServer } from "@/lib/supabaseServer";
import CommentForm from "@/components/CommentForm";
import CommentList from "@/components/CommentList";

interface PostDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = await params;  // ⬅ 여기 한 줄이 핵심!
  const numId = Number(id);

  if (isNaN(numId)) {
    return <div className="text-white pt-24 px-4">잘못된 게시글 ID입니다.</div>;
  }

  const { data: post } = await supabaseServer
    .from("posts")
    .select("*")
    .eq("id", numId)
    .single();

  if (!post) {
    return <div className="text-white pt-24 px-4">게시글을 찾을 수 없습니다.</div>;
  }

  const { data: comments = [] } = await supabaseServer
    .from("comments")
    .select("*")
    .eq("post_id", numId)
    .order("created_at", { ascending: true });

  return (
    <div className="min-h-screen text-white pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-gray-900 border border-white/10 rounded-xl p-6 shadow-md">

        <h1 className="text-2xl font-bold text-blue-300 mb-4">{post.title}</h1>
        <p className="text-white/80 whitespace-pre-wrap">{post.content}</p>
        <span className="text-xs text-white/50 mt-2 block">
          작성일: {new Date(post.created_at).toLocaleString()}
        </span>

        <CommentList comments={comments} />
        <CommentForm postId={numId} />

      </div>
    </div>
  );
}
