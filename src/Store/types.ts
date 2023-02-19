    export interface Excercise {
        name: string;
        type: string;
        id: number;
    }

    export interface Excercises {
        chest: Excercise[];
        back: Excercise[];
        legs: Excercise[];
        shoulders: Excercise[];
        cardio: Excercise[];
        biceps: Excercise[];
        triceps: Excercise[];
        abs: Excercise[];
    }

        export interface Set {
        weight: number;
        reps: number;
    }


    export interface WorkoutExcercise {
        name: string;
        type: string;
        id: number;
        sets: Set[];
    }

    export interface Workout {
        excercises: WorkoutExcercise[];
        date: string;
    }

    export interface User {
        name: string;
        height: number;
        plans: any[];
        weight: any[];
        workouts: Workout[];
    }