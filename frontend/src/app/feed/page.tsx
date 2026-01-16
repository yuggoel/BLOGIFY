"use client";

import { useEffect, useState } from "react";
import type { Post } from "@/lib/api";

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/posts`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await res.json();
        console.log("FEED RESPONSE:", data); // 👈 IMPORTANT

        // ✅ handle both possible response shapes
        const postsArray = Array.isArray(data) ? data : data.posts;

        setPosts(postsArray || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load feed");
      } finally {
        setLoading(false); // ✅ ALWAYS stop loading
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {posts.length === 0 ? (
        <p>No posts found</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} style={{ border: "1px solid #ccc", margin: 10 }}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
          </div>
        ))
      )}
    </div>
  );
}
