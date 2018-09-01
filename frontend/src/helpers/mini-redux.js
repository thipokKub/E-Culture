function createStore(reducer, initialState) {
    let currentReducer = reducer;
    let currentState = initialState;
    let listener = () => { };
    return {
        getState() {
            return currentState;
        },
        dispatch(action) {
            currentState = currentReducer(currentState, action);
            listener(); // Note that we added this line!
            return action;
        },
        subscribe(newListener) {
            listener = newListener;
        }
    };
}

export default createStore;