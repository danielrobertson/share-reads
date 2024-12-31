import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/node";
import { Client, fql } from "fauna";
import invariant from "tiny-invariant";
import { BookList } from "~/types";

export async function action({ request, params, context }: ActionFunctionArgs) {
  const { listId } = params;
  invariant(listId, "Expected params.listId");

  const body = await request.formData();
  const bookJson = body.get("book");
  const newBook = JSON.parse(bookJson as string);

  const client = new Client({
    secret: context.cloudflare.env.FAUNA_SECRET,
  });

  switch (request.method) {
    case "PUT": {
      // update list with book
      try {
        const result = await client.query<BookList>(fql`
          let list = BookList.byId(${listId})!
          list.update({
            books: list.books.concat([${newBook}])
          })
          `);

        return json({ result });
      } catch (error) {
        // TODO Sentry
        console.error("Database error:", error);
        return json({ error: "Database error" }, { status: 500 });
      }

      break;
    }
    case "DELETE": {
      // remove book from list
      break;
    }
  }
}
