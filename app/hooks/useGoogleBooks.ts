import { useQuery } from "@tanstack/react-query";
import { GoogleBooksSearchResponse } from "~/types";

export const useGoogleBooks = ({ query }: { query: string | undefined }) => {
  return useQuery({
    enabled: !!query,
    queryKey: ["google-books", query],
    queryFn: async (): Promise<GoogleBooksSearchResponse> => {
      if (!query) {
        return { items: [], totalItems: 0 };
      }

      // TODO: add KV caching layer here
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          query
        )}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }

      return response.json();
    },
  });
};
