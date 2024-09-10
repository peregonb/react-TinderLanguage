import { FC, memo } from 'react';
import { Layout } from 'antd';
import { Route } from 'react-router-dom';
import PageMainList from '@pages/PageMainList';
import PageCards from '@pages/PageCards';
import Header from '@components/Header';
import PageCreateItem from '@pages/PageCreateItem';

import '@styles/App.scss'
import css from '@styles/components/layout.module.scss'
import cn from 'classnames';

const App: FC = () => (
    <Layout className={css.Layout}>
        <Header/>
        <Layout className={cn(css.Layout_wrapper, 'wrapper')}>
            <Route path={'/'} exact render={() => <PageMainList/>}/>
            <Route path={'/create'} render={() => <PageCreateItem/>}/>
            <Route path={'/play/id:itemId?'} render={() => <PageCards/>}/>
            <Route path={'/edit/id:itemId?'} render={() => <PageCreateItem/>}/>
        </Layout>
    </Layout>
);

export default memo(App);
