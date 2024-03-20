export interface routine {
    title: string;
    color: string;
    progress: number;
    id: number;
    entry_id: number;
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
}

export interface indexDataShape {
    routine_data: routine | null;
    routine_habits: habit[];
}