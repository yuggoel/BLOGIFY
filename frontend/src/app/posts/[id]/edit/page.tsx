

import EditForm from './EditForm';

export async function generateStaticParams() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`);
  const posts = await res.json();
  return posts.map((post: any) => ({ id: String(post.id) }));
}

export default async function Page({ params }: { params: { id: string } }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${params.id}`);
  const post = await res.json();
  return <EditForm id={params.id} initialPost={post} />;
}
