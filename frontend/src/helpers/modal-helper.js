import createStore from './mini-redux';

const types = {
    'OPEN': 'Open modal',
    'CLOSE': 'Close modal',
    'TOGGLE': 'Togle modal',
    'SET': 'Set modal item',
    'RESET': 'Reset modal item',
    'SETnOPEN': 'Set modal item and show modal',
    'RESETnCLOSE': 'Clear modal item and close modal'
}

const ModalTypes = {
    'NONE': 'No info yet',
    'FULL': 'Full description',
    'LIST': 'List of description'
}

const emptyItem = {
    type: ModalTypes.NONE,
    data: [{}]
}

const initialState = {
    isOpen: false,
    item: { ...emptyItem }
}

function ModalState(state = { ...initialState }, action) {
    switch (action.type) {
        case types.OPEN:
            return { ...state, isOpen: true };
        case types.CLOSE:
            return { ...state, isOpen: false };
        case types.TOGGLE:
            return { ...state, isOpen: !state.isOpen };
        case types.SET:
            return { ...state, item: { ...action.payload } };
        case types.RESET:
            return { ...state, item: { ...emptyItem }};
        case types.SETnOPEN:
            return { ...state, item: { ...action.payload }, isOpen: true }
        case types.RESETnCLOSE:
            return { ...state, item: { ...emptyItem }, isOpen: false }
        default:
            return state
    }
}

const ModalStore = createStore(ModalState);

export default {
    ModalStore,
    types,
    ModalTypes
};