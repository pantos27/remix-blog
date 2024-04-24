import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import invariant from "tiny-invariant";

import { createPost } from "~/models/post.server";
import { useMemo } from "react";

const inputClassName =
  "w-full rounded border border-gray-500 px-2 py-1 text-lg";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  await new Promise((resolve)=>setTimeout(resolve,1600));

  const title = formData.get("title");
  const slug = formData.get("slug");
  const markdown = formData.get("markdown");

  const errors = {
    title: title ? null : "Title is required",
    slug: slug ? null: "Slug is required",
    markdown: markdown ? null : "Markdown is required"
  }

  const hasError = Object.values(errors).some(
    (errorMessage) => errorMessage
  );

  if (hasError){
    return json(errors);
  }

  invariant(
    typeof title === "string",
    "title must be a string"
  );
  invariant(
    typeof slug === "string",
    "slug must be a string"
  );
  invariant(
    typeof markdown === "string",
    "markdown must be a string"
  );

  await createPost({ slug, title, markdown });

  return redirect("/posts/admin");
};
export default function NewPost() {

  const errors = useActionData<typeof action>();

  const navigation = useNavigation();
  const isCreating = useMemo(() => {
    return navigation.state === "submitting";
  }, [navigation.state]);
  return (
    <Form method="post">
      <p>
        <label>
          Post Title:{" "}
          {errors?.title ? (
            <em className="text-red-600">{errors.title}</em>
          ): null}
          <input
            type="text"
            name="title"
            className={inputClassName}
          />
        </label>
      </p>
      <p>
        <label>
          Post Slug:{" "}
          {errors?.slug ? (
            <em className="text-red-600">{errors.slug}</em>
          ): null}
          <input
            type="text"
            name="slug"
            className={inputClassName}
          />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">
          Markdown:{" "}
          {errors?.markdown ? (
            <em className="text-red-600">{errors.markdown}</em>
          ): null}
        </label>
        <br />
        <textarea
          id="markdown"
          rows={15}
          name="markdown"
          className={`${inputClassName} font-mono`}
        />
      </p>
      <p className="text-right">
        <button
          type="submit"
          disabled={isCreating}
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
        >
          {isCreating? "Creating..." : "Create Post"}
        </button>
      </p>
    </Form>
  );
}
