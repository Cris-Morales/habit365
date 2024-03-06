import { dataShape } from "./types/propTypes"

const dummyData: dataShape[] = [
    {
        routine_data: {
            title: 'Daily',
            color: '#00ffff',
            current_streak: 6,
            total_days: 20,
            date_diff: 60,
            id: 1
        },
        routine_habits: [
            {
                title: 'Practice Coding',
                color: '#db7093',
                current_streak: 59,
                total_days: 59,
                date_diff: 60,
                id: 4
            },
            {
                title: 'Exercise',
                color: '#7cfc00',
                current_streak: 6,
                total_days: 48,
                date_diff: 60,
                id: 2
            },
            {
                title: 'Drink a Gallon of Water',
                color: '#48d1cc',
                current_streak: 6,
                total_days: 35,
                date_diff: 60,
                id: 3
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
            id: 2
        },
        routine_habits: [
            {
                title: 'Meditation',
                color: '#ffd700',
                current_streak: 6,
                total_days: 27,
                date_diff: 60,
                id: 1
            },
            {
                title: 'See the Sunrise',
                color: '#ffff00',
                current_streak: 6,
                total_days: 56,
                date_diff: 60,
                id: 5
            },
            {
                title: 'Cold Shower',
                color: '#f0f8ff',
                current_streak: 6,
                total_days: 19,
                date_diff: 60,
                id: 6
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
            id: 3
        },
        routine_habits: [
            {
                title: 'Stretch',
                color: '#7fff00',
                current_streak: 6,
                total_days: 35,
                date_diff: 60,
                id: 7
            },
            {
                title: 'Journal',
                color: '#008b8b',
                current_streak: 6,
                total_days: 23,
                date_diff: 60,
                id: 8
            },
            {
                title: 'See the Sunset',
                color: '#ff8c00',
                current_streak: 6,
                total_days: 20,
                date_diff: 60,
                id: 9
            }
        ]
    }
]

export default dummyData