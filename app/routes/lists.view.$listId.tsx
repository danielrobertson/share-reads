import { Plus } from "lucide-react";
import invariant from "tiny-invariant";

import { LinksFunction, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/node";
import {
  Links,
  Meta,
  Scripts,
  useLoaderData,
  ScrollRestoration,
} from "@remix-run/react";
import BookResultCard from "~/components/book-result-card";

import "./../tailwind.css";
import { StickyHeader } from "~/components/sticky-header";
import { Client, fql } from "fauna";
import { BookList } from "~/types";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export async function loader({ params, context }: LoaderFunctionArgs) {
  invariant(params.listId, "Expected params.listId");

  try {
    const client = new Client({
      secret: context.cloudflare.env.FAUNA_SECRET,
    });

    const result = await client.query<BookList>(fql`
      let list = BookList.byId(${params.listId})!
      list
      `);

    console.log(result);

    return json({ booklist: result.data });
  } catch (error) {
    console.error(error);
    return json({ booklist: null }, { status: 500 });
  }
}

export default function ListViewPage() {
  const { booklist } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="flex h-screen justify-center">
          <div className="flex flex-col w-full max-w-3xl px-4">
            <StickyHeader>
              <a
                href="/"
                className="text-sm text-secondary-foreground transition-colors flex items-center justify-center gap-1 border rounded-md px-3 py-1.5 hover:border-foreground"
              >
                <Plus className="w-4 h-4" /> Create
              </a>
            </StickyHeader>
            <main>
              <ul className="mt-3 space-y-2">
                {booklist?.books.map((book) => (
                  <li
                    key={book.id}
                    className="flex justify-between items-center"
                  >
                    <a href={book.volumeInfo.previewLink} className="w-full">
                      <BookResultCard book={book} />
                    </a>
                  </li>
                ))}
              </ul>
            </main>
          </div>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
