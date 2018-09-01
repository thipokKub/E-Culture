import createStore from './mini-redux';

const types = {
    'OPEN': 'Open modal',
    'CLOSE': 'Close modal',
    'TOGGLE': 'Togle modal',
}

function ModalState(state = false, action) {
    switch (action.type) {
        case types.OPEN:
            return true;
        case types.CLOSE:
            return false;
        case types.TOGGLE:
            return !state;
        default:
            return state
    }
}

const ModalStore = createStore(ModalState);

export default {
    ModalStore,
    types
};