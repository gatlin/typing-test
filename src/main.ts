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

app.store.subscribe(() => {
    //console.log(app.store.getState());
});

// We should set the document title.
document.title = 'Typing Test';

// And we're off
app.start();
