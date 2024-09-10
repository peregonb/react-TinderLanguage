import { IAppState } from '@redux/store.ts';

export interface IAppSelector<R> {
    (state: IAppState): R;
}

export default function createSelector<R, R1>(parentSelector: IAppSelector<R1>, selector: (state: R1) => R): IAppSelector<R> {
    return state => selector(parentSelector(state));
}