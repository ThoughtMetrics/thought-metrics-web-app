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

const storeImplementation = (set: any) => ({
  // Initial State
  selectedContent: null,
  contentFilters: {},
  viewMode: 'grid' as const,

  // Actions
  setSelectedContent: (content: Content | null) =>
    set({ selectedContent: content }, false, 'setSelectedContent'),

  setContentFilters: (filters: ContentFilters) =>
    set({ contentFilters: filters }, false, 'setContentFilters'),

  updateContentFilter: <K extends keyof ContentFilters>(
    key: K,
    value: ContentFilters[K]
  ) =>
    set(
      (state: ContentState) => ({
        contentFilters: {
          ...state.contentFilters,
          [key]: value,
        },
      }),
      false,
      'updateContentFilter'
    ),

  clearFilters: () => set({ contentFilters: {} }, false, 'clearFilters'),

  setViewMode: (mode: 'grid' | 'list') => set({ viewMode: mode }, false, 'setViewMode'),
});

export const useContentStore = create<ContentState>()(
  import.meta.env.DEV
    ? devtools(storeImplementation, { name: 'content-store' })
    : storeImplementation
);
