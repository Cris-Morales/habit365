import { dataShape } from "./types/dataTypes"

// dates stored a utc
const dummyData: dataShape[] = [
    {
        routine_data: {
            title: 'Undefined',
            color: '#00ffff',
            current_streak: 6,
            total_days: 20,
            date_diff: 60,
            id: 1,
            start_date: '2024-01-02',
            created_at: '2024-01-02',
            longest_streak: 20,
            intention: undefined,
            frequency: undefined,
        },
        routine_habits: [
            {
                title: 'Connect with Someone',
                color: '#db7093',
                current_streak: 59,
                total_days: 59,
                date_diff: 60,
                id: 4,
                start_date: '2024-01-02',
                created_at: '2024-01-02',
                longest_streak: 59,
                intention: 'To work on socialization and to fulfil/give a social need.',
                frequency: [true, false, true, false, true, true, true]
            },
            {
                title: 'Practice Juggling',
                color: '#7cfc00',
                current_streak: 6,
                total_days: 48,
                date_diff: 60,
                id: 2,
                start_date: '2024-01-02',
                created_at: '2024-01-02',
                longest_streak: 15,
                intention: undefined,
                frequency: [true, false, true, false, true, true, true]
            },
            {
                title: 'Train Brazilian Jiu Jitsu',
                color: '#48d1cc',
                current_streak: 6,
                total_days: 35,
                date_diff: 60,
                id: 3,
                start_date: '2024-01-02',
                created_at: '2024-01-02',
                longest_streak: 10,
                intention: undefined,
                frequency: [true, false, true, false, true, true, true]
            },
        ]
    },
    {
        routine_data: {
            title: 'Daily',
            color: '#00ffff',
            current_streak: 6,
            total_days: 20,
            date_diff: 60,
            id: 1,
            start_date: '2024-01-02',
            created_at: '2024-01-02',
            longest_streak: 20,
            intention: undefined,
            frequency: [true, false, true, false, true, true, true]
        },
        routine_habits: [
            {
                title: 'Practice Coding',
                color: '#db7093',
                current_streak: 59,
                total_days: 59,
                date_diff: 60,
                id: 4,
                start_date: '2024-01-02',
                created_at: '2024-01-02',
                longest_streak: 59,
                intention: undefined,
                frequency: [true, false, true, false, true, true, true]
            },
            {
                title: 'Exercise',
                color: '#7cfc00',
                current_streak: 6,
                total_days: 48,
                date_diff: 60,
                id: 2,
                start_date: '2024-01-02',
                created_at: '2024-01-02',
                longest_streak: 15,
                intention: undefined,
                frequency: [true, false, true, false, true, true, true]
            },
            {
                title: 'Drink a Gallon of Water',
                color: '#48d1cc',
                current_streak: 6,
                total_days: 35,
                date_diff: 60,
                id: 3,
                start_date: '2024-01-02',
                created_at: '2024-01-02',
                longest_streak: 10,
                intention: undefined,
                frequency: [true, false, true, false, true, true, true]
            },
        ]
    },
    {
        routine_data: {
            title: 'Post-Morning Coffee Dookie Sit-down',
            color: '#ff8c00',
            current_streak: 6,
            total_days: 50,
            date_diff: 60,
            id: 2,
            start_date: '2024-01-02',
            created_at: '2024-01-02',
            longest_streak: 14,
            intention: undefined,
            frequency: undefined
        },
        routine_habits: [
            {
                title: 'Meditation',
                color: '#ffd700',
                current_streak: 6,
                total_days: 27,
                date_diff: 60,
                id: 1,
                start_date: '2024-01-02',
                created_at: '2024-01-02',
                longest_streak: 15,
                intention: undefined,
                frequency: [true, false, true, false, true, true, true]
            },
            {
                title: 'See the Sunrise',
                color: '#ffff00',
                current_streak: 6,
                total_days: 56,
                date_diff: 60,
                id: 5,
                start_date: '2024-01-02',
                created_at: '2024-01-02',
                longest_streak: 50,
                intention: undefined,
                frequency: [true, false, true, false, true, true, true]
            },
            {
                title: 'Cold Shower',
                color: '#f0f8ff',
                current_streak: 6,
                total_days: 19,
                date_diff: 60,
                id: 6,
                start_date: '2024-01-02',
                created_at: '2024-01-02',
                longest_streak: 12,
                intention: undefined,
                frequency: [true, false, true, false, true, true, true]
            }
        ]
    },
    {
        routine_data: {
            title: 'Evening',
            color: '#9400d3',
            current_streak: 6,
            total_days: 42,
            date_diff: 60,
            id: 3,
            start_date: '2024-01-02',
            created_at: '2024-01-02',
            longest_streak: 36,
            intention: undefined,
            frequency: [true, false, true, false, true, true, true]
        },
        routine_habits: [
            {
                title: 'Stretch',
                color: '#7fff00',
                current_streak: 6,
                total_days: 35,
                date_diff: 60,
                id: 7,
                start_date: '2024-01-02',
                created_at: '2024-01-02',
                longest_streak: 10,
                intention: undefined,
                frequency: [true, false, true, false, true, true, true]
            },
            {
                title: 'Journal',
                color: '#008b8b',
                current_streak: 6,
                total_days: 23,
                date_diff: 60,
                id: 8,
                start_date: '2024-01-02',
                created_at: '2024-01-02',
                longest_streak: 14,
                intention: undefined,
                frequency: [true, false, true, false, true, true, true]
            },
            {
                title: 'See the Sunset',
                color: '#ff8c00',
                current_streak: 6,
                total_days: 20,
                date_diff: 60,
                id: 9,
                start_date: '2024-01-02',
                created_at: '2024-01-02',
                longest_streak: 7,
                intention: undefined,
                frequency: [true, false, true, false, true, true, true]
            }
        ]
    }
]

export default dummyData