import { configureStore } from '@reduxjs/toolkit';
import main from '@redux/reducers/main';

const localStorageStore = {
    save: (state: unknown): void => {
        try {
            const serialisedState = JSON.stringify(state);
            localStorage.setItem('persistentState', serialisedState);
        } catch (e) {
            console.warn(e);
        }
    },
    load: (): unknown => {
        try {
            const serialisedState = localStorage.getItem('persistentState');
            if (serialisedState === null) return undefined;
            return JSON.parse(serialisedState);
        } catch (e) {
            console.warn(e);
            return undefined;
        }
    }
}

export const store = configureStore({
    reducer: {
        main,
    },
    preloadedState: localStorageStore.load(),
});

store.subscribe(() => localStorageStore.save(store.getState()));

export type IAppStore = typeof store;
export type IAppState = ReturnType<typeof store.getState>;
export type IAppDispatch = typeof store.dispatch;