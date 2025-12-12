import supabaseServer from "@/lib/supabaseServer"; // 위에서 만든 파일

export default async function CommentsPage() {
  const { data: comments, error } = await supabaseServer
    .from("comments")
    .select("*")
    .order("created_at", { ascending: false });

  console.log(comments, error);

  return (
    <div>
      {comments?.map((c) => (
        <div key={c.id}>{c.content}</div>
      ))}
    </div>
  );
}
