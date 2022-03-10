import React from 'react';
import * as ReactDOM from 'react-dom';

import { HistoryRouter } from './components/HistoryRouter';
import ServerConnections from './components/ServerConnections';
import history from './history';
import AppRoutes from './routes';

// FIXME: Just importing minimal styling so content is readable
import './scripts/autoThemes';
import './scripts/libraryMenu';

import './assets/css/site.scss';
import './assets/css/fonts.scss';

async function init() {
    ServerConnections.getApiClients();

    try {
        await ServerConnections.connect();
    } catch (err) {
        console.error('Unable to connect', err);
    }

    ReactDOM.render(
        <HistoryRouter history={history}>
            <AppRoutes />
        </HistoryRouter>,
        document.getElementById('root')
    );
}

init();
