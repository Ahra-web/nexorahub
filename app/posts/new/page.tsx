"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("posts").insert([
      {
        title,
        content,
      },
    ]);

    setLoading(false);

    if (error) {
      alert("Error creating post");
      console.error(error);
      return;
    }

    router.push("/"); // 작성 완료 후 메인으로 이동
  };

  return (
    <div className="flex flex-col items-center min-h-screen pt-24 px-4">
      <div className="max-w-xl w-full bg-gray-900 p-6 rounded-xl border border-white/10">
        <h1 className="text-2xl font-bold text-blue-300 mb-4">Create a Post</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-3 rounded bg-gray-800 border border-white/20 text-white"
            required
          />

          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="p-3 rounded bg-gray-800 border border-white/20 text-white h-40 resize-none"
            required
          ></textarea>

          <button
            type="submit"
            disabled={loading}
            className="p-3 bg-blue-500 hover:bg-blue-400 text-black font-semibold rounded transition"
          >
            {loading ? "Creating..." : "Create Post"}
          </button>
        </form>
      </div>
    </div>
  );
}
