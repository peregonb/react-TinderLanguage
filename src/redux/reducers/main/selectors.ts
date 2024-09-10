import { IMainState } from '@redux/reducers/main/types.ts';
import createSelector, { IAppSelector } from '@redux/utils/createSelector.ts';

export const mainSelector: IAppSelector<IMainState> = state => state.main;

export const mainRootSelectors = {
    headline: createSelector(mainSelector, state => state.headline),
    list: createSelector(mainSelector, state => state.list),
};
