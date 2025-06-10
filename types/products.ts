// Milestones
export interface Milestone {
    id: string
    title: string
    description: string
    targetDate: string
    achievedDate?: string
    status: 'pending' | 'achieved'
}

export interface JournalEntry {
    id: string | null;
    date: string;
    content: string;
    mood: string;
    tags: string[];
}

// Tasks
export interface Task {
    id: string;
    title: string;
    description?: string;
    status: string;
    priority: 'low' | 'medium' | 'high';
    dueDate: string;
    createdAt?: string;
    updatedAt?: string;
}

// Contacts
export interface Contact {
    id: string;
    name: string;
    contactNo: string;
    tags: string[];
}

// Calendar events
export interface CalendarEvent {
    id: string;
    title: string;
    start: string;
    end: string;
    color?: string;
    description?: string;
}
