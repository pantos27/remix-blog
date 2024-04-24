import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";

import { getPosts } from "~/models/post.server";
import { getUserId } from "~/session.server";

export const loader = async ({request}: LoaderFunctionArgs) => {
  const [userId, posts] = await Promise.all([getUserId(request),getPosts()])
  return json({
    posts: posts,
    isLoggedIn: userId != undefined
  });
};
export default function Posts() {
  const { posts, isLoggedIn } = useLoaderData<typeof loader>();
  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">Posts</Link>
        </h1>
        {isLoggedIn ? <Form action="/logout" method="post">
          <button
            type="submit"
            className="rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Logout
          </button>
        </Form> : null}
      </header>
    <main >

      <ul>
        {posts.map((post) =>
          (<li key={post.slug}>
            <Link
              to={post.slug}
              className="text-blue-600 underline">
              {post.title}
            </Link>
          </li>)
        )}
      </ul>
      { isLoggedIn ? <Link to="admin" className="text-red-600 underline">
        Admin
      </Link> : null}
    </main>
    </div>
  );
}
