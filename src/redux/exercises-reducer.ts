import {getUniqID} from "@components/common/helpers";

const SET_EXERCISES = 'SET_EXERCISES';
const CHANGE_EXERCISE = 'CHANGE_EXERCISE';
const DELETE_EXERCISE = 'DELETE_EXERCISE';

let initialState = {
    exercisesList: [
        {"name": "Жим штанги лежа", "tags": ["Грудь"], "id": 1, "key": "1"},
        {"name": "Разведения гантель в наклоне", "tags": ["Грудь"], "id": 2, "key": "2"},
        {"name": "Подъем штанги на бицепс", "tags": ["Бицепс"], "id": 3, "key": "3"},
        {"name": "Жим штанги лежа в наклоне", "tags": ["Грудь"], "id": 4, "key": "4"},
        {"name": "Отжимания на брусьях", "tags": ["Грудь", "Трицепс"], "id": 5, "key": "5"},
        {"name": "Подтягивания обратным хватом", "tags": ["Бицепс", "Спина"], "id": 6, "key": "6"},
        {"name": "Жим гантелей сидя", "tags": ["Плечи"], "id": 7, "key": "7"},
        {"name": "Тяга блока к груди", "tags": ["Спина", "Плечи"], "id": 8, "key": "8"},
        {"name": "Махи гантелей", "tags": ["Плечи"], "id": 9, "key": "9"},
        {"name": "Приседания", "tags": ["Ноги"], "id": 10, "key": "10"}
    ],
};

export type exercise = {
    name: string,
    tags: string[],
    key: string,
    id: number
}

interface I_setExercise {
    type: typeof SET_EXERCISES
    name: string
    tags: string[]
}

interface I_changeExercise {
    type: typeof CHANGE_EXERCISE
    id: number
    name: string
    tags: string[]
}

interface I_deleteExercise {
    type: typeof DELETE_EXERCISE
    id: number
}

type actionType = I_setExercise | I_changeExercise | I_deleteExercise;

const exercisesReducer = (state = initialState, action: actionType) => {
    switch (action.type) {
        case SET_EXERCISES:
            return {
                ...state,
                exercisesList: [...state.exercisesList, {
                    name: action.name.trim(),
                    tags: action.tags,
                    id: getUniqID(state.exercisesList),
                    key: `${getUniqID(state.exercisesList)}`
                }]
            };

        case CHANGE_EXERCISE:
            return {
                ...state,
                exercisesList: state.exercisesList.map(el => el.id === action.id ? {
                    ...el,
                    name: action.name.trim(),
                    tags: action.tags
                } : el)
            };

        case DELETE_EXERCISE:
            return {
                ...state,
                exercisesList: state.exercisesList.filter(el => el.id !== action.id)
            };

        default:
            return state
    }
};

export const setExercise = (name: string, tags: string[]): I_setExercise => {
    return {
        type: SET_EXERCISES,
        name, tags
    }
};

export const changeExercise = (id: number, name: string, tags: string[]): I_changeExercise => {
    return {
        type: CHANGE_EXERCISE,
        id, name, tags
    }
};

export const deleteExercise = (id: number): I_deleteExercise => {
    return {
        type: DELETE_EXERCISE,
        id
    }
};


export default exercisesReducer