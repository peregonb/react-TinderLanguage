import { FC, memo } from 'react';
import { Layout } from 'antd';
import { Route } from 'react-router-dom';
import PageMainList from '@pages/PageMainList';
import PageCards from '@pages/PageCards';
import PageEditList from '@pages/PageEditList';
import Header from '@components/Header';

import '@styles/App.scss'
import css from '@styles/components/layout.module.scss'
import cn from 'classnames';

const App: FC = () => (
    <Layout className={css.Layout}>
        <Header/>
        <Layout className={cn(css.Layout_wrapper, 'wrapper')}>
            <Route path={'/'} exact render={() => <PageMainList/>}/>
            <Route path={'/list'} exact render={() => <PageEditList/>}/>
            <Route path={'/list/:listId'} render={() => <PageEditList/>}/>
            <Route path={'/play/:listId?'} render={() => <PageCards/>}/>
        </Layout>
    </Layout>
);

export default memo(App);
