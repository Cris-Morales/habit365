export interface routine {
    title: string;
    color: string;
    current_streak: number;
    total_days: number;
    date_diff: number;
    id: number;
    start_date: string;
    created_at: string;
    longest_streak: number;
    intention: string | undefined;
    frequency: boolean[] | undefined;
}
export interface habit {
    id: number;
    title: string;
    color: string;
    current_streak: number;
    total_days: number;
    date_diff: number;
    start_date: string;
    created_at: string;
    longest_streak: number;
    intention: string | undefined;
    frequency: boolean[]
}

export interface dataShape {
    routine_data: routine;
    routine_habits: habit[];
}