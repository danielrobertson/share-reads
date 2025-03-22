import { useSearchParams } from "@remix-run/react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/remix";

export function StickyHeader({ children }: { children?: React.ReactNode }) {
  const [searchParams] = useSearchParams();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center">
        <div className="mr-4 flex justify-between w-full">
          <a href="/" className="mr-6 flex items-center space-x-2" aria-hidden>
            <img src="/icon.png" alt="ShareReads" className="h-6 w-6" />
            <span className="font-bold">ShareReads</span>
          </a>
          <div className="flex items-center gap-2">{children && children}</div>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton
              signUpForceRedirectUrl={`/search?${searchParams.toString()}`}
            >
              <button className="text-sm text-muted-foreground">Sign in</button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
