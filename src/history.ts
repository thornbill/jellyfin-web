import { createHashHistory } from 'history';

const history = createHashHistory({ window });

history.listen(({ action, location }) => {
    console.debug('history change', action, location);
});

export default history;
