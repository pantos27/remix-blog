import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { marked } from "marked";
import invariant from "tiny-invariant";

import { getPost, getPosts } from "~/models/post.server";
import { requireUserId } from "~/session.server";



export const loader = async ({params, request}: LoaderFunctionArgs) => {
  invariant(params.slug,"slug is required")
  const [ post] = await Promise.all([getPost(params.slug),requireUserId(request)])
  invariant(post,"post not found")
  const html = marked(post.markdown)
  return json({post, html })
}
export default function PostSlug() {
  const { post, html} = useLoaderData<typeof loader>();
  return (
    <main className="mx-auto max-w-4xl">
      <h1 className="my-6 border-b-2 text-center text-3xl">
        {post.title}
      </h1>
      <div dangerouslySetInnerHTML={{ __html: html}} />
    </main>
  );
}
