import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { MetaFunction, redirect } from "@remix-run/react";
import { Client, fql } from "fauna";
import { commitSession, getSession } from "~/sessions.server";

export const meta: MetaFunction = () => {
  return [
    { title: "ShareReads" },
    { name: "description", content: "Create and share lists of books" },
  ];
};

export const loader = async ({ context, request }: LoaderFunctionArgs) => {
  try {
    const session = await getSession(request, context.cloudflare.env);

    const client = new Client({
      secret: context.cloudflare.env.FAUNA_SECRET,
    });

    const editToken = crypto.randomUUID();

    const result = await client.query<string>(fql`
      let newList = BookList.create({ books: [], editToken: ${editToken} })
      newList.id
    `);

    // light weight edit auth until we have a user
    // @ts-expect-error session is not typed
    session.set(`edit_token_${result.data}`, editToken);

    return redirect(`/lists/edit/${result.data}`, {
      headers: {
        "Set-Cookie": await commitSession(session, context.cloudflare.env),
      },
    });
  } catch (error) {
    console.error("Database connection error:", error);
    throw new Response("Internal Server Error", { status: 500 });
  }
};
