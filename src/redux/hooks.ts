import {
    useStore as plainUseStore,
    useDispatch as plainUseDispatch,
    useSelector as plainUseSelector,
} from 'react-redux';

import { IAppStore, IAppDispatch, IAppState } from '@redux/store.ts';

export const useStore = plainUseStore.withTypes<IAppStore>();
export const useDispatch = plainUseDispatch.withTypes<IAppDispatch>();
export const useSelector = plainUseSelector.withTypes<IAppState>();
