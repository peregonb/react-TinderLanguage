import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';

import App from './App';
import Theme from './Theme';
import store from '@redux/store';

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <Theme>
                <App/>
            </Theme>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root'));
