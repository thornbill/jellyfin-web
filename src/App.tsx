import { History } from '@remix-run/router';
import React, { useEffect } from 'react';

import { HistoryRouter } from './components/HistoryRouter';
import ServerConnections from './components/ServerConnections';
import { ApiProvider } from './hooks/useApi';
import AppRoutes from './routes/index';

const App = ({ history, connections }: { history: History, connections: typeof ServerConnections }) => {
    useEffect(() => {
        Promise.all([
            // Initialize the UI components after first render
            import('./scripts/libraryMenu'),
            import('./scripts/autoBackdrops')
        ]);
    }, []);

    return (
        <ApiProvider connections={connections}>
            <HistoryRouter history={history}>
                <div className='backdropContainer' />
                <div className='backgroundContainer' />

                <div className='mainDrawer hide'>
                    <div className='mainDrawer-scrollContainer scrollContainer focuscontainer-y' />
                </div>
                <div className='skinHeader focuscontainer-x' />

                <div className='mainAnimatedPages skinBody' />
                <div className='skinBody'>
                    <AppRoutes />
                </div>

                <div className='mainDrawerHandle' />
            </HistoryRouter>
        </ApiProvider>
    );
};

export default App;
