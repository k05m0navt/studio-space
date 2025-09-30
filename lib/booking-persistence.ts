// Booking State Persistence System
// Hybrid approach: sessionStorage (auto-save) + localStorage (manual save)

const STORAGE_KEYS = {
  AUTO_SAVE: 'booking_draft_auto',
  MANUAL_SAVE: 'booking_draft_manual',
  TIMESTAMP: 'booking_draft_timestamp',
} as const;

const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export interface BookingDraft {
  bookingType: 'studio' | 'coworking';
  name: string;
  email: string;
  phone: string;
  date?: Date;
  startTime: string;
  endTime: string;
  message?: string;
  version: number;
}

const CURRENT_VERSION = 1;

// Serialize date properly for storage
function serializeDraft(draft: Partial<BookingDraft>): string {
  const serialized = {
    ...draft,
    date: draft.date ? draft.date.toISOString() : undefined,
    version: CURRENT_VERSION,
    timestamp: Date.now(),
  };
  return JSON.stringify(serialized);
}

// Deserialize and validate stored data
function deserializeDraft(data: string): Partial<BookingDraft> | null {
  try {
    const parsed = JSON.parse(data);
    
    // Check version compatibility
    if (parsed.version !== CURRENT_VERSION) {
      console.warn('Booking draft version mismatch, discarding old data');
      return null;
    }
    
    // Check TTL
    const age = Date.now() - (parsed.timestamp || 0);
    if (age > TTL_MS) {
      console.warn('Booking draft expired, discarding');
      return null;
    }
    
    // Parse date back to Date object
    const draft: Partial<BookingDraft> = {
      ...parsed,
      date: parsed.date ? new Date(parsed.date) : undefined,
    };
    
    // Remove metadata
    delete (draft as any).version;
    delete (draft as any).timestamp;
    
    return draft;
  } catch (error) {
    console.error('Failed to deserialize booking draft:', error);
    return null;
  }
}

// Auto-save to sessionStorage (clears on tab close)
export function autoSaveBookingDraft(draft: Partial<BookingDraft>): void {
  if (typeof window === 'undefined') return;
  
  try {
    const serialized = serializeDraft(draft);
    sessionStorage.setItem(STORAGE_KEYS.AUTO_SAVE, serialized);
  } catch (error) {
    console.error('Failed to auto-save booking draft:', error);
  }
}

// Manual save to localStorage (persists across sessions)
export function manualSaveBookingDraft(draft: Partial<BookingDraft>): void {
  if (typeof window === 'undefined') return;
  
  try {
    const serialized = serializeDraft(draft);
    localStorage.setItem(STORAGE_KEYS.MANUAL_SAVE, serialized);
    localStorage.setItem(STORAGE_KEYS.TIMESTAMP, Date.now().toString());
  } catch (error) {
    console.error('Failed to manually save booking draft:', error);
  }
}

// Restore draft (check sessionStorage first, then localStorage)
export function restoreBookingDraft(): { draft: Partial<BookingDraft> | null; source: 'auto' | 'manual' | null } {
  if (typeof window === 'undefined') return { draft: null, source: null };
  
  // Try sessionStorage first (most recent session)
  const autoSaved = sessionStorage.getItem(STORAGE_KEYS.AUTO_SAVE);
  if (autoSaved) {
    const draft = deserializeDraft(autoSaved);
    if (draft) {
      return { draft, source: 'auto' };
    }
  }
  
  // Try localStorage (manual save from previous session)
  const manualSaved = localStorage.getItem(STORAGE_KEYS.MANUAL_SAVE);
  if (manualSaved) {
    const draft = deserializeDraft(manualSaved);
    if (draft) {
      return { draft, source: 'manual' };
    }
  }
  
  return { draft: null, source: null };
}

// Clear all saved drafts
export function clearBookingDrafts(): void {
  if (typeof window === 'undefined') return;
  
  sessionStorage.removeItem(STORAGE_KEYS.AUTO_SAVE);
  localStorage.removeItem(STORAGE_KEYS.MANUAL_SAVE);
  localStorage.removeItem(STORAGE_KEYS.TIMESTAMP);
}

// Check if draft exists
export function hasSavedDraft(): boolean {
  if (typeof window === 'undefined') return false;
  
  return !!(
    sessionStorage.getItem(STORAGE_KEYS.AUTO_SAVE) ||
    localStorage.getItem(STORAGE_KEYS.MANUAL_SAVE)
  );
}

// Get draft age in milliseconds
export function getDraftAge(): number | null {
  if (typeof window === 'undefined') return null;
  
  const timestamp = localStorage.getItem(STORAGE_KEYS.TIMESTAMP);
  if (!timestamp) return null;
  
  return Date.now() - parseInt(timestamp, 10);
}

// Format draft age for display
export function formatDraftAge(ageMs: number): string {
  const minutes = Math.floor(ageMs / (60 * 1000));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'just now';
}
