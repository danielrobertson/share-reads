import { useEffect, useState } from "react";
import copy from "copy-to-clipboard";
import { Book, Check, Copy } from "lucide-react";
import invariant from "tiny-invariant";
import { Client, fql } from "fauna";

import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";

import { StickyHeader } from "~/components/sticky-header";
import { BookSearchWithListComponent } from "~/components/book-search-with-list";
import BookResultCard from "~/components/book-result-card";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useBooklist } from "~/components/contexts/BooklistContext";
import { BookList } from "~/types";
import { getSession } from "~/sessions.server";

export const loader = async ({
  params,
  context,
  request,
}: LoaderFunctionArgs) => {
  invariant(params.listId, "Expected params.listId");

  try {
    const client = new Client({
      secret: context.cloudflare.env.FAUNA_SECRET,
    });

    const response = await client.query<BookList>(fql`
      let list = BookList.byId(${params.listId})!
      list
    `);

    const booklist = response.data;
    console.log(booklist);

    const session = await getSession(request, context.cloudflare.env);

    // @ts-expect-error session is not typed
    const sessionToken = session.get(`edit_token_${booklist.id}`);

    if (sessionToken !== booklist.editToken) {
      throw new Response("Unauthorized", { status: 401 });
    }

    return json({ booklist });
  } catch (error) {
    console.error(error);
    if (error instanceof Response) {
      throw error;
    }

    throw new Response("List not found", { status: 404 });
  }
};

export default function EditListPage() {
  const { booklist } = useLoaderData<typeof loader>();
  const listId = booklist.id;

  const { bookList } = useBooklist();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const copyShareUrl = async (id: string) => {
    const url = `${window.location.origin}/lists/view/${id}`;

    try {
      // mobile browsers prefer to use the share api
      if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        await navigator.share({
          url,
        });
      } else {
        // desktop browsers
        copy(url);
      }
    } catch (err) {
      // User canceled or share failed
      console.error("Share failed");
    } finally {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 5000);
    }
  };

  useEffect(() => {
    if (!isDialogOpen) {
      setIsCopied(false);
    }
  }, [isDialogOpen]);

  return (
    <div className="container px-3 mx-auto flex h-screen justify-center">
      <div className="flex flex-col items-center gap-16 w-full max-w-3xl">
        <StickyHeader>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="relative px-3"
                id="view-book-list-button"
              >
                <Book size={36} />
                {bookList.length > 0 && (
                  <span className="absolute -top-[8px] -right-[8px] bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-[12px] font-medium">
                    {bookList.length}
                  </span>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Your Book List</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <Button
                  onClick={() => copyShareUrl(listId)}
                  className="w-full mb-4"
                  id="copy-share-link-button"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Share Link
                    </>
                  )}
                </Button>
                <div className="max-h-[60vh] overflow-y-auto">
                  {bookList.length > 0 ? (
                    <ul className="space-y-2">
                      {bookList.map((book) => (
                        <li
                          key={book.id}
                          className="flex justify-between items-center"
                        >
                          <BookResultCard book={book} />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Your book list is empty. Add some books!
                    </p>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </StickyHeader>
        <main className="max-w-3xl">
          <BookSearchWithListComponent listId={listId} />
        </main>
      </div>
    </div>
  );
}
