import { useEffect, useState } from "react";
import copy from "copy-to-clipboard";
import {
  Book,
  Check,
  Copy,
  LibraryBig,
  Search,
  Share,
  User,
} from "lucide-react";
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
import { MenuBar } from "~/components/ui/bottom-menu";

function SearchPageBottomNav() {
  return (
    <div className="flex items-center justify-center fixed bottom-0 left-0 right-0 p-6">
      <MenuBar
        items={[
          {
            icon: () => <Search />,
            label: "Search",
          },
          {
            icon: () => <LibraryBig />,
            label: "Your lists",
          },
          {
            icon: () => <User />,
            label: "Profile",
          },
        ]}
      />
    </div>
  );
}

export default function SearchPage() {
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
      <div className="flex flex-col items-center gap-16 w-full h-full max-w-3xl">
        <StickyHeader />
        <main className="max-w-3xl">
          <BookSearchWithListComponent />
        </main>
      </div>
      <SearchPageBottomNav />
    </div>
  );
}
