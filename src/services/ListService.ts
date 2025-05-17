
import { BookVolume } from "./BookAPI";

export type BookList = {
  id: string;
  name: string;
  description: string;
  books: BookVolume[];
  createdAt: number;
  updatedAt: number;
};

// Using localStorage for this example
// In a real application, this would be a backend service
const LISTS_STORAGE_KEY = 'sharereads-lists';

// Generate a random ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Get all lists from localStorage
export const getLists = (): BookList[] => {
  const listsJson = localStorage.getItem(LISTS_STORAGE_KEY);
  if (!listsJson) return [];
  
  try {
    return JSON.parse(listsJson);
  } catch (e) {
    console.error("Error parsing lists from localStorage:", e);
    return [];
  }
};

// Save lists to localStorage
const saveLists = (lists: BookList[]): void => {
  localStorage.setItem(LISTS_STORAGE_KEY, JSON.stringify(lists));
};

// Get a single list by ID
export const getList = (listId: string): BookList | null => {
  const lists = getLists();
  return lists.find(list => list.id === listId) || null;
};

// Create a new list
export const createList = (name: string, description = ""): BookList => {
  const newList: BookList = {
    id: generateId(),
    name,
    description,
    books: [],
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  
  const lists = getLists();
  lists.push(newList);
  saveLists(lists);
  
  return newList;
};

// Update a list
export const updateList = (list: BookList): BookList => {
  const lists = getLists();
  const index = lists.findIndex(l => l.id === list.id);
  
  if (index === -1) {
    throw new Error(`List with ID ${list.id} not found`);
  }
  
  list.updatedAt = Date.now();
  lists[index] = list;
  saveLists(lists);
  
  return list;
};

// Add a book to a list
export const addBookToList = (listId: string, book: BookVolume): BookList => {
  const lists = getLists();
  const index = lists.findIndex(l => l.id === listId);
  
  if (index === -1) {
    throw new Error(`List with ID ${listId} not found`);
  }
  
  // Check if the book is already in the list
  const bookExists = lists[index].books.some(b => b.id === book.id);
  if (!bookExists) {
    lists[index].books.push(book);
    lists[index].updatedAt = Date.now();
    saveLists(lists);
  }
  
  return lists[index];
};

// Remove a book from a list
export const removeBookFromList = (listId: string, bookId: string): BookList => {
  const lists = getLists();
  const index = lists.findIndex(l => l.id === listId);
  
  if (index === -1) {
    throw new Error(`List with ID ${listId} not found`);
  }
  
  lists[index].books = lists[index].books.filter(book => book.id !== bookId);
  lists[index].updatedAt = Date.now();
  saveLists(lists);
  
  return lists[index];
};

// Delete a list
export const deleteList = (listId: string): void => {
  const lists = getLists();
  const filteredLists = lists.filter(list => list.id !== listId);
  saveLists(filteredLists);
};

// Get a shareable URL for a list
export const getShareableUrl = (listId: string): string => {
  return `${window.location.origin}/list/${listId}`;
};

// Copy the shareable URL to clipboard
export const copyShareableUrl = async (listId: string): Promise<boolean> => {
  const url = getShareableUrl(listId);
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch (e) {
    console.error("Failed to copy URL to clipboard:", e);
    return false;
  }
};
