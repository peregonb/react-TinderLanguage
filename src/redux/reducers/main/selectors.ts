import { IMainState } from '@redux/reducers/main/types';
import createSelector, { IAppSelector } from '@redux/utils/createSelector';

export const mainSelector: IAppSelector<IMainState> = state => state.main;

export const mainRootSelectors = {
    headline: createSelector(mainSelector, state => state.headline),
    list: createSelector(mainSelector, state => state.list),
};
