import { Alm } from 'alm';

import { State, initialState } from './store';
import { Actions } from './actions';
import MainView from './views/MainView';
import reducer from './reducer';

// The actual application.
const app = new Alm<State, Actions>({
    model: initialState,
    update: reducer,
    view: MainView(),
    domRoot: 'main',
    eventRoot: 'main'
});

// Set the test timer when it's time.
app.store.subscribe(() => {
    const { do_set_timer } = app.store.getState();
    if (do_set_timer) {
        window.setTimeout(() => {
            app.store.dispatch({
                type: Actions.Stop
            });
        }, 60000);
    }
});

// We should set the document title.
document.title = 'Typing Test';

// And we're off
app.start();
