export interface IMainState {
    headline: string,
    list: Array<IListItemSingle>
}

export interface IListItemSingle {
    id: string,
    name: string,
    words: Array<IListItemData>,
}

export type IListItemData = IListItemValues & {
    id: string
}

export type IListItemValues = {
    original: string,
    translation: string,
    info_original?: string,
    info_translation?: string
}