import { QueryValue } from "fauna";

export type GoogleBookVolumeInfo = {
  title: string;
  authors?: string[];
  description?: string;
  imageLinks?: {
    thumbnail: string;
  };
  publishedDate?: string;
  previewLink: string;
};

export interface BookResult {
  [key: string]: QueryValue;
  id: string;
  volumeInfo: GoogleBookVolumeInfo;
}

export type BookList = {
  [key: string]: QueryValue;
  id: string;
  name: string;
  books: BookResult[];
  userId: string;
};

export type GoogleBooksSearchResponse = {
  items?: BookResult[];
  totalItems: number;
};

/**
 * Fauna DB types
 */

export interface Page<T> {
  data: T[];
  after?: string; // cursor for next page
}
