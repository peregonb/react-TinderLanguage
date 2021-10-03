import {I_listItemSingle} from "@redux/types";

const SET_LIST = 'SET_LIST';
const DELETE_LIST = 'DELETE_LIST';

let initialState = {
    list: [
        {
            "name": "Apartment stuff",
            "words": [
                {
                    key: '0',
                    id: '0',
                    original: 'Яблоко',
                    translation: 'Apple',
                    excerpt: {
                        original: 'yabloko',
                        translation: ''
                    }
                },
                {
                    key: '1',
                    id: '1',
                    original: 'Яблоко',
                    translation: 'Apple',
                    excerpt: {
                        original: 'yabloko',
                        translation: ''
                    }
                }
            ],
            "id": 0,
            "key": "0"
        },
        {
            "name": "Garden stuff",
            "words": [
                {
                    key: '0',
                    id: '0',
                    original: 'Яблоко',
                    translation: 'Apple',
                    excerpt: {
                        original: 'yabloko',
                        translation: ''
                    }
                },
                {
                    key: '1',
                    id: '1',
                    original: 'Яблоко',
                    translation: 'Apple',
                    excerpt: {
                        original: 'yabloko',
                        translation: ''
                    }
                }
            ],
            "id": 1,
            "key": "1"
        }
    ]
};

export interface I_setList {
    type: typeof SET_LIST
    listItem: I_listItemSingle
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
                list: [...state.list, action.listItem],
            };

        case DELETE_LIST:
            return {
                ...state,
                list: state.list.filter(el => el.id !== action.id)
            };

        default:
            return state
    }
};

export const setList = (listItem: I_listItemSingle): I_setList => {
    return {
        type: SET_LIST,
        listItem
    }
};

export const deleteList = (id: number): I_deleteList => {
    return {
        type: DELETE_LIST,
        id
    }
};

export default appReducer;