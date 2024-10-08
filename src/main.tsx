import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import App from '@components/App/App';
import Theme from '@components/Theme/Theme';
import { store } from '@redux/store';

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <BrowserRouter>
            <Theme>
                <StrictMode>
                    <App/>
                </StrictMode>
            </Theme>
        </BrowserRouter>
    </Provider>,
)
