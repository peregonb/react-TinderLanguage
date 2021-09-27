import {I_listItem} from "@redux/types";

const SET_LIST = 'SET_LIST';
const DELETE_LIST = 'DELETE_LIST';

let initialState = {
    list: [
        {
            "name": "Apartment stuff",
            "words": [["bed", "кровать"], ["table", "стол"], ["carpet", "кровать"]],
            "id": 0,
            "key": "0"
        },
        {
            "name": "Garden stuff",
            "words": [["shovel", "лопата"], ["chainsaw", "бензопила"], ["brick", "кирпич"]],
            "id": 1,
            "key": "1"
        }
    ]
};

export interface I_setList {
    type: typeof SET_LIST
    list: I_listItem
}

export interface I_deleteList {
    type: typeof DELETE_LIST
    id: number
}

type actionType = I_setList | I_deleteList;

const appReducer = (state = initialState, action: actionType) => {
    switch (action.type) {
        case SET_LIST:
            return {
                ...state,
                list: action.list,
            };

        case DELETE_LIST:
            console.log('delete!!', state.list.filter(el => el.id !== action.id))
            return {
                ...state,
                list: state.list.filter(el => el.id !== action.id)
            };

        default:
            return state
    }
};

export const setList = (list: I_listItem): I_setList => {
    return {
        type: SET_LIST,
        list
    }
};

export const deleteList = (id: number): I_deleteList => {
    return {
        type: DELETE_LIST,
        id
    }
};

export default appReducer;