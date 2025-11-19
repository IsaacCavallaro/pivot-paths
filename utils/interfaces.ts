export interface JournalEntry {
    id: string;
    pathTag: string;
    date: string;
    content: string;
    mood?: string | null;
}
