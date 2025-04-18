import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";

import { Label } from "./ui/field";
import { Input } from "./ui/input";

export const LIST_NAME_FORM_FIELD = "listName";

export default function CreateListButton() {
  const fetcher = useFetcher();
  const [open, setOpen] = useState(false);

  // Watch fetcher state to close dialog on success
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      setOpen(false);
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="default">
          <Plus />
          Create list
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create list</DialogTitle>
          <DialogDescription>
            Enter a name for your book list to get started.
          </DialogDescription>
        </DialogHeader>

        <fetcher.Form action="/list" method="post">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                List name
              </Label>
              <Input
                id={LIST_NAME_FORM_FIELD}
                name={LIST_NAME_FORM_FIELD}
                placeholder="My favorites"
                className="col-span-3"
                autoComplete="off"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={fetcher.state !== "idle"}>
              {fetcher.state !== "idle" ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  );
}
