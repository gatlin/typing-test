/**
 * @module actions
 * Two sorts of things are exported from here: the {@link Actions} enum and the
 * actual action creators.
 */

export enum Actions {
    Init,
    GoBack,
    NextWord,
    KeyPress,
    Stop
};

export const initialize = data => ({
    type: Actions.Init,
    data
});

export const keyPress = data => ({
    type: Actions.KeyPress,
    data
});

export const goBack = () => ({
    type: Actions.GoBack
});

export const nextWord = () => ({
    type: Actions.NextWord
});
