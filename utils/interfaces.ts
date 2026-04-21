export interface JournalEntry {
    id: string;
    pathTag: string;
    day: string;
    category: string;
    pathTitle: string;
    dayTitle: string;
    date: string;
    timestamp: number;
    content: string;
    mood?: string;
}
