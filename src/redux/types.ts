export interface I_appReducer {
    headline: string,
    list: I_listItemSingle[]
}

export interface I_state {
    app: I_appReducer,
}

export interface I_listItemSingle {
    id: number,
    key: string
    name: string,
    words: T_elementData[],
}

export type T_elementData = T_itemValues & {
    key: string,
    id: number
}

export type T_itemValues = {
    original: string,
    translation: string,
    excerpt: {
        original: string,
        translation: string
    }
}