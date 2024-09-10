export interface IMainState {
    headline: string,
    list: Array<IListItemSingle>
}

export interface IListItemSingle {
    id: number,
    key: string
    name: string,
    words: Array<IElementData>,
}

export type IElementData = IItemValues & {
    key: string,
    id: number
}

export type IItemValues = {
    original: string,
    translation: string,
    excerpt: {
        original: string,
        translation: string
    }
}