// src/types/album.ts
// NEW: Tipo Album esteso per shared albums

export interface Album {
    id: string;
    title: string;
    coverUri?: string;
    videoIds: string[]; // mantieni il tuo campo attuale per i media
    createdAt: string;
    updatedAt?: string;
  
    // NEW (permessi)
    ownerId: string;                // NEW
    contributors: string[];         // NEW
    viewers?: string[];             // NEW (non usato ora)
  }
  
  // Helper permessi (puoi anche importarlo dove serve)
  export const canUserUploadToAlbum = (userId: string, album: Album): boolean => {
    // NEW
    return album.ownerId === userId || album.contributors.includes(userId);
  };
  