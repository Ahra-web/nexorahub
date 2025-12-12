"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function CommentForm({ postId }: { postId: number }) {
  const [content, setContent] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase
      .from("comments")
      .insert([{ post_id: postId, content }]);

    if (error) {
      alert("댓글 작성 실패: " + error.message);
    } else {
      setContent("");
      router.refresh(); // 댓글 새로고침
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-6">
      <textarea
        className="bg-black border border-white/20 p-2 rounded text-white resize-none h-24"
        placeholder="댓글을 입력하세요..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-400 text-black py-2 rounded"
      >
        댓글 작성
      </button>
    </form>
  );
}
