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
  books: BookResult[];
};

export type GoogleBooksSearchResponse = {
  items?: BookResult[];
  totalItems: number;
};
