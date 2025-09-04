// src/stores/content.store.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Content, ContentFilters } from '@/core/types/content.type';

interface ContentState {
  // State
  selectedContent: Content | null;
  contentFilters: ContentFilters;
  viewMode: 'grid' | 'list';

  // Actions
  setSelectedContent: (content: Content | null) => void;
  setContentFilters: (filters: ContentFilters) => void;
  updateContentFilter: <K extends keyof ContentFilters>(
    key: K,
    value: ContentFilters[K]
  ) => void;
  clearFilters: () => void;
  setViewMode: (mode: 'grid' | 'list') => void;
}

export const useContentStore = create<ContentState>()(
  devtools(
    (set) => ({
      // Initial State
      selectedContent: null,
      contentFilters: {},
      viewMode: 'grid',

      // Actions
      setSelectedContent: (content) =>
        set({ selectedContent: content }, false, 'setSelectedContent'),

      setContentFilters: (filters) =>
        set({ contentFilters: filters }, false, 'setContentFilters'),

      updateContentFilter: (key, value) =>
        set(
          (state) => ({
            contentFilters: {
              ...state.contentFilters,
              [key]: value,
            },
          }),
          false,
          'updateContentFilter'
        ),

      clearFilters: () => set({ contentFilters: {} }, false, 'clearFilters'),

      setViewMode: (mode) => set({ viewMode: mode }, false, 'setViewMode'),
    }),
    {
      name: 'content-store',
    }
  )
);
