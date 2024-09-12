import { FC, memo } from 'react';
import { Layout } from 'antd';
import { Route } from 'react-router-dom';
import PageMainList from '@pages/Catalog/Catalog.tsx';
import PageCards from '@pages/Cards/Cards.tsx';
import PageEditList from '@pages/Edit/Edit.tsx';
import Header from '@components/Header/Header.tsx';

import '@styles/App.scss'
import css from '@components/App/layout.module.scss'
import cn from 'classnames';

const App: FC = () => (
    <Layout className={css.Layout}>
        <div className={css.Layout_inner}>
            <Header/>
            <Layout className={cn(css.Layout_wrapper, 'wrapper')}>
                <Route path={'/'} exact render={() => <PageMainList/>}/>
                <Route path={'/list'} exact render={() => <PageEditList/>}/>
                <Route path={'/list/:listId'} render={() => <PageEditList/>}/>
                <Route path={'/play/:listId?'} render={() => <PageCards/>}/>
            </Layout>
        </div>
    </Layout>
);

export default memo(App);
