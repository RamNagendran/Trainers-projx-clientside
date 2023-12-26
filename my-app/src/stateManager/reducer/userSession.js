

let initialState = {
    userDetails: null,
    authToken: null
}

const userSession = (state = initialState, action = {}) => {
    switch (action.type) {
        case 'LOGIN_CREDENTIALS':
            return {
                ...state,
                userDetails: action.userDetails,
                authToken: action.token
            }
        default:
            return state;
    }
}

export default userSession;