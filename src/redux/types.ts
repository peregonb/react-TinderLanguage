export interface I_appReducer {
    list: I_listItem
}

export interface I_state {
    app: I_appReducer,
}

export interface I_listItemSingle {
    name: string,
    words: string[][],
    id: number,
    key: string
}

export type I_listItem = I_listItemSingle[];