let initialState = {
    selectedUser: null,
    allTasks: null
}

const analyticsStates = (state = initialState, action = {}) => {
    switch (action.type) {
        case 'SELECTED_USER':
            return {
                ...state,
                selectedUser: action.data
            }
        case 'ALL_TASKS':
            return {
                ...state,
                allTasks: action.data
            }
        default:
            return state;
    }
}

export default analyticsStates;