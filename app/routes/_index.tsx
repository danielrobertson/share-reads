import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { MetaFunction, redirect } from "@remix-run/react";
import { Client, fql } from "fauna";

export const BOOKS_FORM_KEY = "books";

export const meta: MetaFunction = () => {
  return [
    { title: "ShareReads" },
    { name: "description", content: "Create and share lists of books" },
  ];
};

export const loader = async ({ context }: LoaderFunctionArgs) => {
  try {
    const client = new Client({
      secret: context.cloudflare.env.FAUNA_SECRET,
    });

    const result = await client.query<string>(fql`
      let newList = BookList.create({ books: [] })
      newList.id
    `);

    return redirect(`/lists/edit/${result.data}`);
  } catch (error) {
    console.error("Database connection error:", error);
    throw new Response("Internal Server Error", { status: 500 });
  }
};
