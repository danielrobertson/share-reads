
import { supabase } from "@/integrations/supabase/client";
import { BookVolume } from "./BookAPI";
import { toast } from "sonner";

export type BookList = {
  id: string;
  name: string;
  description: string | null;
  books: BookVolume[];
  createdAt: number;
  updatedAt: number;
};

// Fetch all lists for the current user
export const fetchLists = async (): Promise<BookList[]> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      return [];
    }
    
    const { data: lists, error } = await supabase
      .from('lists')
      .select('*')
      .order('updated_at', { ascending: false });
      
    if (error) throw error;
    
    // Now fetch books for each list
    const listsWithBooks = await Promise.all(
      lists.map(async (list) => {
        const { data: booksInList, error: booksError } = await supabase
          .from('books_in_lists')
          .select('book_data')
          .eq('list_id', list.id);
          
        if (booksError) throw booksError;
        
        const books = booksInList.map(item => item.book_data as BookVolume);
        
        return {
          id: list.id,
          name: list.name,
          description: list.description || "",
          books: books,
          createdAt: new Date(list.created_at).getTime(),
          updatedAt: new Date(list.updated_at).getTime(),
        };
      })
    );
    
    return listsWithBooks;
  } catch (error) {
    console.error("Error fetching lists:", error);
    return [];
  }
};

// Get a single list by ID
export const fetchList = async (listId: string): Promise<BookList | null> => {
  try {
    const { data: list, error } = await supabase
      .from('lists')
      .select('*')
      .eq('id', listId)
      .single();
      
    if (error) throw error;
    
    const { data: booksInList, error: booksError } = await supabase
      .from('books_in_lists')
      .select('book_data')
      .eq('list_id', listId);
      
    if (booksError) throw booksError;
    
    const books = booksInList.map(item => item.book_data as BookVolume);
    
    return {
      id: list.id,
      name: list.name,
      description: list.description || "",
      books: books,
      createdAt: new Date(list.created_at).getTime(),
      updatedAt: new Date(list.updated_at).getTime(),
    };
  } catch (error) {
    console.error("Error fetching list:", error);
    return null;
  }
};

// Create a new list
export const createList = async (name: string, description = ""): Promise<BookList | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      toast("You must be signed in to create a list");
      return null;
    }
    
    const { data: list, error } = await supabase
      .from('lists')
      .insert([
        { 
          name, 
          description: description || null,
          user_id: user.user.id
        }
      ])
      .select()
      .single();
      
    if (error) throw error;
    
    return {
      id: list.id,
      name: list.name,
      description: list.description || "",
      books: [],
      createdAt: new Date(list.created_at).getTime(),
      updatedAt: new Date(list.updated_at).getTime(),
    };
  } catch (error) {
    console.error("Error creating list:", error);
    toast("Failed to create list. Please try again.");
    return null;
  }
};

// Update a list
export const updateList = async (list: Partial<BookList> & { id: string }): Promise<BookList | null> => {
  try {
    const { data: updatedList, error } = await supabase
      .from('lists')
      .update({ 
        name: list.name,
        description: list.description || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', list.id)
      .select()
      .single();
      
    if (error) throw error;
    
    // Get the books to return the complete list
    const { data: booksInList, error: booksError } = await supabase
      .from('books_in_lists')
      .select('book_data')
      .eq('list_id', list.id);
      
    if (booksError) throw booksError;
    
    const books = booksInList.map(item => item.book_data as BookVolume);
    
    return {
      id: updatedList.id,
      name: updatedList.name,
      description: updatedList.description || "",
      books: books,
      createdAt: new Date(updatedList.created_at).getTime(),
      updatedAt: new Date(updatedList.updated_at).getTime(),
    };
  } catch (error) {
    console.error("Error updating list:", error);
    toast("Failed to update list. Please try again.");
    return null;
  }
};

// Add a book to a list
export const addBookToList = async (listId: string, book: BookVolume): Promise<BookList | null> => {
  try {
    // Check if book already exists in the list
    const { data: existingBook, error: checkError } = await supabase
      .from('books_in_lists')
      .select()
      .eq('list_id', listId)
      .eq('book_id', book.id)
      .maybeSingle();
      
    if (checkError) throw checkError;
    
    if (existingBook) {
      // Book already in list, just return the list
      return await fetchList(listId);
    }
    
    // Add the book
    const { error } = await supabase
      .from('books_in_lists')
      .insert([
        { 
          list_id: listId,
          book_id: book.id,
          book_data: book
        }
      ]);
      
    if (error) throw error;
    
    // Update the list's updated_at timestamp
    await supabase
      .from('lists')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', listId);
    
    return await fetchList(listId);
  } catch (error) {
    console.error("Error adding book to list:", error);
    toast("Failed to add book to list. Please try again.");
    return null;
  }
};

// Remove a book from a list
export const removeBookFromList = async (listId: string, bookId: string): Promise<BookList | null> => {
  try {
    const { error } = await supabase
      .from('books_in_lists')
      .delete()
      .eq('list_id', listId)
      .eq('book_id', bookId);
      
    if (error) throw error;
    
    // Update the list's updated_at timestamp
    await supabase
      .from('lists')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', listId);
    
    return await fetchList(listId);
  } catch (error) {
    console.error("Error removing book from list:", error);
    toast("Failed to remove book from list. Please try again.");
    return null;
  }
};

// Delete a list
export const deleteList = async (listId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('lists')
      .delete()
      .eq('id', listId);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error deleting list:", error);
    toast("Failed to delete list. Please try again.");
    return false;
  }
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
