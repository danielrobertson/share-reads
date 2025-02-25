import { LibraryBig, Search, User } from "lucide-react";
import { MetaFunction, useLoaderData } from "@remix-run/react";
import { getAuth } from "@clerk/remix/ssr.server";
import { LoaderFunctionArgs } from "@remix-run/cloudflare";

import { StickyHeader } from "~/components/sticky-header";
import { BookSearch } from "~/components/book-search";
import { MenuBar } from "~/components/ui/bottom-menu";

export const meta: MetaFunction = () => {
  return [{ title: "ShareReads | Search" }];
};

export const loader = async (args: LoaderFunctionArgs) => {
  const { userId } = await getAuth(args);

  return { userId };
};

function SearchPageBottomNav() {
  return (
    <div className="flex items-center justify-center fixed bottom-0 left-0 right-0 p-6">
      <MenuBar
        items={[
          {
            icon: () => <Search />,
            label: "Search",
            href: "/search",
          },
          {
            icon: () => <LibraryBig />,
            label: "Your lists",
            href: "/lists",
          },
          {
            icon: () => <User />,
            label: "Profile",
            href: "/profile",
          },
        ]}
      />
    </div>
  );
}

export default function SearchPage() {
  const { userId } = useLoaderData<typeof loader>();
  console.log("🚀 ~ SearchPage ~ userId:", userId);

  return (
    <div className="container px-3 mx-auto flex h-screen justify-center">
      <div className="flex flex-col items-center gap-16 w-full h-full max-w-3xl">
        <StickyHeader />
        <main className="max-w-3xl">
          <h1 className="text-3xl font-bold text-center ">
            Quickly create shareable book lists
          </h1>
          <BookSearch />
        </main>
      </div>
      <SearchPageBottomNav />
    </div>
  );
}
