import { create } from 'zustand';

interface SelectedThumbnail {
  id: string;
  type: 'image' | 'video' | 'audio';
}

interface ThumbnailSelectionStore {
  selectedItem: SelectedThumbnail | null;
  setSelectedItem: (item: SelectedThumbnail | null) => void;
  clearSelection: () => void;
  isSelected: (id: string, type: SelectedThumbnail['type']) => boolean;
  setSelectedItemOnAdd: (id: string, type: SelectedThumbnail['type']) => void;
}

export const useThumbnailSelectionStore = create<ThumbnailSelectionStore>((set, get) => ({
  selectedItem: null,
  
  setSelectedItem: (item) => set({ selectedItem: item }),
  
  clearSelection: () => set({ selectedItem: null }),
  
  isSelected: (id, type) => {
    const { selectedItem } = get();
    return selectedItem?.id === id && selectedItem?.type === type;
  },
  
  setSelectedItemOnAdd: (id, type) => {
    set({ selectedItem: { id, type } });
  },
}));