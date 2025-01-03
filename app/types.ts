import { QueryValue } from "fauna";

export interface BookResult {
  [key: string]: QueryValue;
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail: string;
    };
    publishedDate?: string;
    previewLink: string;
  };
}

export type BookList = {
  [key: string]: QueryValue;
  id: string;
  books: BookResult[];
};
