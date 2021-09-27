import {combineReducers, createStore} from "redux";
import appReducer from "./app-reducer";
import {I_state} from "@redux/types";

let reducers = combineReducers({
    app: appReducer
});

const saveToLocalStorage = (state: I_state) => {
    try {
        const serialisedState = JSON.stringify(state);
        localStorage.setItem("persistentState", serialisedState);
    } catch (e) {
        console.warn(e);
    }
};
const loadFromLocalStorage = () => {
    try {
        const serialisedState = localStorage.getItem("persistentState");
        if (serialisedState === null) return undefined;
        return JSON.parse(serialisedState);
    } catch (e) {
        console.warn(e);
        return undefined;
    }
};


let store = createStore(reducers, loadFromLocalStorage(), (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__());

// @ts-ignore
window.store = store;

store.subscribe(() => saveToLocalStorage(store.getState()));

export default store;