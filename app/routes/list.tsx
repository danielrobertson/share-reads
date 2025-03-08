import { getAuth } from "@clerk/remix/ssr.server";
import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { Client, fql } from "fauna";

import { LIST_NAME_FORM_FIELD } from "~/components/CreateListButton";

// create new list given name
export async function action(args: ActionFunctionArgs) {
  const { context, request } = args;
  const { userId } = await getAuth(args);

  const body = await request.formData();
  const name = body.get(LIST_NAME_FORM_FIELD);

  const client = new Client({
    secret: context.cloudflare.env.FAUNA_SECRET,
  });

  const result = await client.query<string>(fql`
    BookList.create({ name: ${name}, books: [] })
  `);

  console.log("🚀 ~ action ~ result:", result);

  return { success: true };
}
