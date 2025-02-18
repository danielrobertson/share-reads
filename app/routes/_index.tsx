import { MetaFunction } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "ShareReads" },
    { name: "description", content: "Create and share lists of books" },
  ];
};

export const loader = async () => {};
