import {I_listItemSingle} from "@redux/types";

const SET_HEADER_TITLE = 'SET_HEADER_TITLE';
const SET_LIST = 'SET_LIST';
const CHANGE_LIST = 'CHANGE_LIST';
const DELETE_LIST = 'DELETE_LIST';

let initialState = {
    headline: "",
    list: [
        {
            "name": "Apartment stuff",
            "words": [
                {
                    key: '0',
                    id: 0,
                    original: 'Яблоко',
                    translation: 'Apple',
                    excerpt: {
                        original: 'yabloko',
                        translation: ''
                    }
                },
                {
                    key: '1',
                    id: 1,
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
                    id: 3,
                    original: 'Яблоко',
                    translation: 'Apple',
                    excerpt: {
                        original: 'yabloko',
                        translation: ''
                    }
                },
                {
                    key: '1',
                    id: 4,
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

export interface I_setHeaderTitle {
    type: typeof SET_HEADER_TITLE
    headline: string
}

export interface I_setList {
    type: typeof SET_LIST
    listItem: I_listItemSingle
}

export interface I_deleteList {
    type: typeof DELETE_LIST
    id: number
}

export interface I_changeList {
    type: typeof CHANGE_LIST
    listItem: I_listItemSingle
    id: string
}

type actionType = I_setList | I_deleteList | I_changeList | I_setHeaderTitle;

const appReducer = (state = initialState, action: actionType) => {
    switch (action.type) {
        case SET_HEADER_TITLE:
            return {
                ...state,
                headline: action.headline
            };

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

        case CHANGE_LIST:
            return {
                ...state,
                list: state.list.map(el => el.id === parseInt(action.id) ? {...action.listItem} : el)
            };

        default:
            return state
    }
};

export const setHeaderTitle = (headline: string): I_setHeaderTitle => {
    return {
        type: SET_HEADER_TITLE,
        headline
    }
};

export const setList = (listItem: I_listItemSingle): I_setList => {
    return {
        type: SET_LIST,
        listItem
    }
};

export const changeList = (listItem: I_listItemSingle, id: string): I_changeList => {
    return {
        type: CHANGE_LIST,
        listItem, id
    }
};

export const deleteList = (id: number): I_deleteList => {
    return {
        type: DELETE_LIST,
        id
    }
};

export default appReducer;