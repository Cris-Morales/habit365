export interface routine {
    title: string;
    color: string;
    current_streak: number;
    total_days: number;
    date_diff: number;
    id: number
}
export interface habit {
    start_data: string;
    title: string;
    created_at: string;
    color: string;
    current_streak: number;
    total_days: number;
    date_diff: number;
    id: number
}

export interface dataShape {
    routine_data: routine;
    routine_habits: habit[];
}