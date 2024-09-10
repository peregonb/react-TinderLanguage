import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IListItemSingle, IMainState } from '@redux/reducers/main/types.ts';

const initialState: IMainState = {
    headline: '',
    list: [
        {
            'name': 'Fruits',
            'words': [
                {
                    key: '0',
                    id: 0,
                    original: 'Apple',
                    translation: '苹果',
                    excerpt: {
                        original: '',
                        translation: 'Píngguǒ'
                    }
                },
                {
                    key: '1',
                    id: 1,
                    original: 'Pear',
                    translation: '梨',
                    excerpt: {
                        original: '',
                        translation: 'Lí'
                    }
                },
                {
                    key: '2',
                    id: 2,
                    original: 'Strawberry',
                    translation: '草莓',
                    excerpt: {
                        original: '',
                        translation: 'Cǎoméi'
                    }
                },
                {
                    key: '3',
                    id: 3,
                    original: 'Orange',
                    translation: '橘子',
                    excerpt: {
                        original: '',
                        translation: 'Júzi'
                    }
                },
                {
                    key: '4',
                    id: 4,
                    original: 'Banana',
                    translation: '香蕉',
                    excerpt: {
                        original: '',
                        translation: 'Xiāngjiāo'
                    }
                },
                {
                    key: '5',
                    id: 5,
                    original: 'Pineapple',
                    translation: '菠萝',
                    excerpt: {
                        original: '',
                        translation: 'Bōluó'
                    }
                },
                {
                    key: '6',
                    id: 6,
                    original: 'Blueberry',
                    translation: '蓝莓',
                    excerpt: {
                        original: '',
                        translation: 'Lánméi'
                    }
                },
                {
                    key: '7',
                    id: 7,
                    original: 'Cherry',
                    translation: '樱桃',
                    excerpt: {
                        original: '',
                        translation: 'Yīngtáo'
                    }
                }
            ],
            'id': 0,
            'key': '0'
        },
        {
            'name': 'Garden stuff',
            'words': [
                {
                    key: '0',
                    id: 3,
                    original: 'Яблоко',
                    translation: 'Apple',
                    excerpt: {
                        original: 'yabloko',
                        translation: 'эпл'
                    }
                },
                {
                    key: '1',
                    id: 4,
                    original: 'Груша',
                    translation: 'Pear',
                    excerpt: {
                        original: 'grusha',
                        translation: 'пир'
                    }
                }
            ],
            'id': 1,
            'key': '1'
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

      addList(state, action: PayloadAction<IListItemSingle>){
          state.list = [...state.list, action.payload]
      },
      deleteList(state, action: PayloadAction<number>) {
          state.list = state.list.filter(el => el.id !== action.payload)
      },
      changeList(state, action: PayloadAction<{ item: IListItemSingle, id: number  }>) {
          state.list = state.list.map(el => el.id === action.payload.id ? {...action.payload.item} : el)
      }
  },
});

export const {
  setHeaderTitle,
  addList,
  deleteList,
  changeList,
} = mainSlice.actions;

export default mainSlice.reducer;