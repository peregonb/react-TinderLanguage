import { FC, memo } from 'react';
import { Layout } from 'antd';
import './assets/styles/App.scss';
import { Route } from 'react-router-dom';
import { PageMainList } from '@pages/PageMainList';
import { PageCards } from '@pages/PageCards';
import Header from '@components/Header';
import { PageCreateItem } from '@pages/PageCreateItem';

const className = 'language';

const App: FC = () => (
    <Layout className={`${className}`}>
        <Header/>
        <Layout className={`${className}-wrapper wrapper`}>
            <Route path={'/'} exact render={() => <PageMainList/>}/>
            <Route path={'/create'} render={() => <PageCreateItem/>}/>
            <Route path={'/play/id:itemId?'} render={() => <PageCards/>}/>
            <Route path={'/edit/id:itemId?'} render={() => <PageCreateItem/>}/>
        </Layout>
    </Layout>
);

export default memo(App);
