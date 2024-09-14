import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IListItemSingle, IMainState } from '@redux/reducers/main/types.ts';

const initialState: IMainState = {
    headline: '',
    list: [
        {
            id: '0',
            name: 'Fruits',
            words: [
                {
                    id: '0',
                    original: 'Apple',
                    translation: '苹果',
                    info_original: '',
                    info_translation: 'Píngguǒ'
                },
                {
                    id: '1',
                    original: 'Pear',
                    translation: '梨',
                    info_original: '',
                    info_translation: 'Lí'
                },
                {
                    id: '2',
                    original: 'Strawberry',
                    translation: '草莓',
                    info_original: '',
                    info_translation: 'Cǎoméi'
                },
                {
                    id: '3',
                    original: 'Orange',
                    translation: '橘子',
                    info_original: '',
                    info_translation: 'Júzi'
                },
                {
                    id: '4',
                    original: 'Banana',
                    translation: '香蕉',
                    info_original: '',
                    info_translation: 'Xiāngjiāo'
                },
                {
                    id: '5',
                    original: 'Pineapple',
                    translation: '菠萝',
                    info_original: '',
                    info_translation: 'Bōluó'
                },
                {
                    id: '6',
                    original: 'Blueberry',
                    translation: '蓝莓',
                    info_original: '',
                    info_translation: 'Lánméi'
                },
                {
                    id: '7',
                    original: 'Cherry',
                    translation: '樱桃',
                    info_original: '',
                    info_translation: 'Yīngtáo'
                }
            ]
        },
        {
            "id": "1",
            "name": "Garden stuff",
            "words": [
                {
                    "id": "0",
                    "original": "Яблоко",
                    "translation": "Apple",
                    "info_original": "yabloko",
                    "info_translation": "эпл"
                },
                {
                    "id": "1",
                    "original": "Груша",
                    "translation": "Pear",
                    "info_original": "grusha",
                    "info_translation": "пир"
                }
            ]
        }
    ]
};

const mainSlice = createSlice({
    name: 'main',
    initialState,
    reducers: {
        setHeaderTitle(state, action: PayloadAction<string>) {
            state.headline = action.payload;
        },

        addList(state, action: PayloadAction<IListItemSingle>) {
            state.list = [action.payload, ...state.list]
        },
        deleteList(state, action: PayloadAction<string>) {
            state.list = state.list.filter(el => el.id !== action.payload)
        },
        setList(state, action: PayloadAction<{ item: IListItemSingle, id: string }>) {
            state.list = state.list.map(el => el.id === action.payload.id ? {...action.payload.item} : el)
        },
    },
});

export const {
    setHeaderTitle,
    addList,
    deleteList,
    setList,
} = mainSlice.actions;

export default mainSlice.reducer;