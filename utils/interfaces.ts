export interface JournalEntry {
    id: string;
    pathTag: string;
    day: string;
    date: string;
    content: string;
    mood?: string | null;
}
