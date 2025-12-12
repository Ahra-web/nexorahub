interface CommentListProps {
  comments: { id: number; content: string; created_at: string }[] | null;
}

export default function CommentList({ comments }: CommentListProps) {
  const safeComments = comments ?? [];

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">댓글</h3>

      {safeComments.length === 0 && (
        <div className="text-white/50">댓글이 없습니다.</div>
      )}

      {safeComments.map((comment) => (
        <div
          key={comment.id}
          className="border border-white/10 bg-black/20 rounded p-3 mt-2"
        >
          <p className="text-white">{comment.content}</p>
          <span className="text-xs text-white/40">
            {new Date(comment.created_at).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}
