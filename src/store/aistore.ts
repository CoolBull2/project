import { create } from 'zustand';
import { type QueryResponse } from '../lib/ai'; // Adjust the import path as needed

interface AiStore {
  query: string | null;
  response: QueryResponse | null;
  setQuery: (query: string | null) => void;
  setResponse: (response: QueryResponse | null) => void;
  reset: () => void;
}

export const useaiStore = create<AiStore>((set) => ({
  query: null,
  response: null,
  setQuery: (query) => set({ query }),
  setResponse: (response) => set({ response }),
  reset: () => set({ query: null, response: null }),
}));
