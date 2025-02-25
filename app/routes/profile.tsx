import { SignInButton, SignOutButton } from "@clerk/remix";
import { LibraryBig, Search, User } from "lucide-react";
import { MenuBar } from "~/components/ui/bottom-menu";

function ProfilePageBottomNav() {
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

export default function Profile() {
  return (
    <>
      <h1 className="text-3xl font-bold text-center">Profile</h1>
      <div className="flex flex-col gap-4 mt-3">
        <SignOutButton />
        <SignInButton />
      </div>
      <ProfilePageBottomNav />
    </>
  );
}
