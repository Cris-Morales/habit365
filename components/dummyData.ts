import { indexDataShape } from "./types/dataTypes"

// dates stored a utc
const dummyData: indexDataShape[] = [
    {
        routine_data: null,
        routine_habits: [
            {
                title: 'Connect with Someone',
                color: '#db7093',
                current_streak: 59,
                hit_total: 59,
                total_days: 60,
                id: 4,
                entry_id: 1,
                status: 0
            },
            {
                title: 'Practice Juggling',
                color: '#7cfc00',
                current_streak: 6,
                hit_total: 48,
                total_days: 60,
                id: 2,
                entry_id: 1,
                status: 0
            },
            {
                title: 'Train Brazilian Jiu Jitsu',
                color: '#48d1cc',
                current_streak: 6,
                hit_total: 35,
                total_days: 60,
                id: 3,
                entry_id: 1,
                status: 0
            },
        ]
    },
    {
        routine_data: {
            title: 'Daily',
            color: '#00ffff',
            id: 1,
            entry_id: 1,
            progress: 0
        },
        routine_habits: [
            {
                title: 'Practice Coding',
                color: '#db7093',
                current_streak: 59,
                hit_total: 59,
                total_days: 60,
                id: 4,
                entry_id: 1,
                status: 0
            },
            {
                title: 'Exercise',
                color: '#7cfc00',
                current_streak: 6,
                hit_total: 48,
                total_days: 60,
                id: 2,
                entry_id: 1,
                status: 0
            },
            {
                title: 'Drink a Gallon of Water',
                color: '#48d1cc',
                current_streak: 6,
                hit_total: 35,
                total_days: 60,
                id: 3,
                entry_id: 1,
                status: 0
            },
        ]
    },
    {
        routine_data: {
            title: 'Post-Morning Coffee Dookie Sit-down',
            color: '#ff8c00',
            id: 2,
            entry_id: 1,
            progress: 0
        },
        routine_habits: [
            {
                title: 'Meditation',
                color: '#ffd700',
                current_streak: 6,
                hit_total: 27,
                total_days: 60,
                id: 1,
                entry_id: 1,
                status: 0
            },
            {
                title: 'See the Sunrise',
                color: '#ffff00',
                current_streak: 6,
                hit_total: 56,
                total_days: 60,
                id: 5,
                entry_id: 1,
                status: 0
            },
            {
                title: 'Cold Shower',
                color: '#f0f8ff',
                current_streak: 6,
                hit_total: 19,
                total_days: 60,
                id: 6,
                entry_id: 1,
                status: 0
            }
        ]
    },
    {
        routine_data: {
            title: 'Evening',
            color: '#9400d3',
            id: 3,
            entry_id: 1,
            progress: 0
        },
        routine_habits: [
            {
                title: 'Stretch',
                color: '#7fff00',
                current_streak: 6,
                hit_total: 35,
                total_days: 60,
                id: 7,
                entry_id: 1,
                status: 0
            },
            {
                title: 'Journal',
                color: '#008b8b',
                current_streak: 6,
                hit_total: 23,
                total_days: 60,
                id: 8,
                entry_id: 1,
                status: 0
            },
            {
                title: 'See the Sunset',
                color: '#ff8c00',
                current_streak: 6,
                hit_total: 20,
                total_days: 60,
                id: 9,
                entry_id: 1,
                status: 0
            }
        ]
    }
]

export default dummyData