export interface routine {
    title: string;
    color: string;
    id: number;
    entry_id: number;
    total_habits: number;
    habits_complete: number
}
export interface habit {
    id: number;
    title: string;
    color: string;
    status: number;
    current_streak: number;
    total_days: number;
    hit_total: number;
    entry_id: number;
    longest_streak: number;
}

export interface habitDetails {
    id: number;
    title: string;
    color: string;
    created_at: string;
    intention: string;
    longest_streak: number;
    routine_id: number;
    routine_title: string;
    start_date: string;
    current_streak: number;
    total_days: number;
    hit_total: number;
    frequency: string[] | null;
}

export interface indexDataShape {
    routine_data: routine | null;
    routine_habits: habit[];
}

export interface habitGridBubbles {
    id: number;
    title: string;
    type: string;
    status: number;
    entry_date_id: number;
    color: string;
}
export interface habitGridStats {
    entries_array: habitGridBubbles[]
}

export interface routineGridBubbles {
    title: string;
    id: number;
    type: string;
    habits_complete: number;
    total_habits: number;
    entry_date_id: number;
    color: string;
}

export interface routineGridStats {
    entries_array: routineGridBubbles[];
}

export interface gridDataShape {
    routineGridStats: routineGridStats | null;
    habitArray: habitGridStats[]
}

export interface gridColumn {
    [date: string]: habitGridBubbles | routineGridBubbles;
}